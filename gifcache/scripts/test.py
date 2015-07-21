import praw
import requests


def scrape_reddit(sub, max_size):
    r = praw.Reddit(user_agent='GifCache Image Grabber by billcrystals')
    submissions = r.get_subreddit(sub).get_hot(limit=100)
    results = []
    for submission in submissions:
        if submission.url.endswith('gifv'):
            response = requests.get(submission.url[:-1])
        else:
            response = requests.get(submission.url)
        try:
            size = '%.2f' % (float(response.headers['content-length']) / 1048576.0)
            if float(size) > float(max_size):
                continue
            else:
                url = submission.url
                extension = url[url.rfind('.') + 1:]
                results.append([submission.url, extension, submission.title, size])
        except KeyError:
            continue
    return results


scrape_reddit('gifs', 5)