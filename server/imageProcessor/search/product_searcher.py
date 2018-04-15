from bs4 import BeautifulSoup
import bottlenose

from imageProcessor.common import cred, constants
from imageProcessor.models import Item

class ProductSearcher:
    """
    Class for finding products from keywords
    """
    def __init__(self):
        self.amazon = bottlenose.Amazon(
            cred.Amazon.ACCESS_KEY,
            cred.Amazon.SECRET_KEY,
            cred.Amazon.ASSOCIATE_ID,
            Parser=lambda text: BeautifulSoup(text, 'xml'))

    def get_found_items(self, keywords):
        """
        Returns a list of Items that are found from keywords
        """
        res = self._search_amazon(keywords, page=1)
        total_results = int(res.find("TotalResults").text)
        total_pages = int(res.find("TotalPages").text)

        items = []
        items.extend(self._parse_items_from_xml(res.find_all("Item")))

        # Return results for up to the first 3 item pages (30 results total)
        MAX_PAGES = 3
        for i in range(2, min(MAX_PAGES + 1, total_pages)):
            res = self._search_amazon(keywords, page=i)
            items.extend(self._parse_items_from_xml(res.find_all("Item")))
        return total_results, items
                
    def _search_amazon(self, keywords, page):
        """
        Conducts a query of Amazon's ItemSearch product advertising API
        """
        return self.amazon.ItemSearch(
            Keywords= " ".join(keywords),
            ItemPage=str(page),
            ResponseGroup="Images,ItemAttributes",
            SearchIndex="Fashion")

    def _parse_items_from_xml(self, items_xml):
        items = []
        for item in items_xml:
            items.append(self._parse_item_from_xml(item))
        return items

    def _parse_item_from_xml(self, item):
        title = ""
        image_url = ""
        product_url = ""
        price = 0

        if item.find("Title"):
            title = item.find("Title").text
        if item.find("LargeImage"):
            image_url = item.find("LargeImage").URL.text
        if item.find("DetailPageURL"):
            product_url = item.find("DetailPageURL").text
        if item.find("Amount"):
            price = int(item.find("Amount").text)
        return Item(title=title, image_url=image_url, product_url=product_url, price=price)
