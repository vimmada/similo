import nltk
import sys
from nltk.corpus import brown
import time

class Recommender(object):
    """docstring for Recommender"""
    def __init__(self):
        super(Recommender, self).__init__()
        self.initIndex()
        
    def initIndex(self):
        wordToFreq = {}
        for w, t in brown.tagged_words():
            if w.lower() not in wordToFreq:
                wordToFreq[w.lower()] = [t]
            else:
                wordToFreq[w.lower()].append(t)
        self.index = wordToFreq

    def generateQueries(self, keywords):
        """
        Input: A list of keywords generated from the image processing
        Output: a list of queries to pass use when searching Google, Amazon
        """
        adjectives = []
        nouns = []
        for word in keywords:
            if self.getPOS(word) == "JJ":
                adjectives.append(word)
            else:
                nouns.append(word)
        queries = []
        for noun in nouns:
            queries.append(" ".join(adjectives+[noun]))
        return queries


    def mostCommon(self, word):
        if word.lower() in self.index:
            dist = nltk.FreqDist(self.index[word.lower()])
            return dist.most_common()
        else:
            return "JJ"

    def getPOS(self, word):
        """
        Input: word
        Action: Tag input word as either noun (NN) or adjective (JJ)
        Output: NN for nouns or JJ for adjectives; default to JJ
        """
        cheat = {"denim": "JJ"}
        if word in cheat:
            return cheat[word]
        # Get most common POS for this word
        mostCommonPOS = self.mostCommon(word)
        # init rank of both adj and noun to very low rankf
        adjRank = 1000
        nounRank = 1000
        # Get ordered tags
        tags = [tup[0] for tup in mostCommonPOS]
        # Extract ranks for tags relating to adjective
        adjTagIdx = [i for i,tag in enumerate(tags) if "JJ" in tag]
        # Extract ranks for tags relating to noun
        nounTagIdx = [i for i,tag in enumerate(tags) if "NN" in tag]
        # if I found an adjective, update rank
        if len(adjTagIdx):
            adjRank = min(adjTagIdx)
        # if I found a noun, update rank
        if len(nounTagIdx):
            nounRank = min(nounTagIdx)
        # if I haven't found either, return nltk tagging (assuming it decides NN or JJ) otherwise return JJ
        if adjRank == 1000 and nounRank == 1000:
            tag = nltk.pos_tag([word])[0][1]
            if "NN" in tag:
                return "NN"
            else:
                return "JJ"
        elif adjRank < nounRank:
            return "JJ"
        else:
            return "NN"


if __name__ == '__main__':
    args = sys.argv[1:]
    print(args)
    start = time.time()
    r = Recommender()
    gen = time.time()
    print("{} seconds to init".format(gen-start))
    print(r.generateQueries(args))
    first = time.time()
    print("{} seconds to generate first".format(first-gen))
    