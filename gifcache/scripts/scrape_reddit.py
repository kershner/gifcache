# Scrapes reddit for small ( < 1.5MB) GIFs
import requests
import praw


def scrape_reddit(sub, reddit):
    # submissions = reddit.get_subreddit(sub).get_hot(limit=200)
    # submissions = reddit.get_subreddit(sub).get_top_from_all(limit=200)
    submissions = reddit.get_subreddit(sub).get_top_from_month(limit=200)
    for submission in submissions:
        if not submission.url.endswith('gif'):
            continue
        elif 'gfy' in submission.url:
            continue
        else:
            response = requests.get(submission.url)
            try:
                size = '%.2f' % (float(response.headers['content-length']) / 1048576.0)
                if float(size) > 1.5:
                    continue
                else:
                    print '%s - %s | %s MB' % (submission.url, submission.title, size)
            except KeyError:
                continue

subreddits = ['gifs', 'aww']
r = praw.Reddit(user_agent='GifCache Image Grabber by billcrystals')
for subreddit in subreddits:
    scrape_reddit(subreddit, r)