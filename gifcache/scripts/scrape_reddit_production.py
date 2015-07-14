# Scrapes reddit for small ( < 1.5MB) GIFs
from datetime import datetime
import requests
import praw


def scrape_reddit(reddit):
    start_time = datetime.now()
    results = {
        'gifs': [],
        'total': '',
        'time': ''
    }
    submissions = reddit.get_subreddit('gifs').get_hot(limit=50)
    for submission in submissions:
        if submission.url.endswith(('.gif', '.mp4', '.gifv', '.webm')):
            response = requests.get(submission.url)
            try:
                url = submission.url
                if url.endswith('.gifv'):
                    size = 'N/A'
                else:
                    size = '%.2f' % (float(response.headers['content-length']) / 1048576.0)
                file_type = url[url.rfind('.') + 1:]
                gif = {
                    'url': url,
                    'title': submission.title,
                    'size': size,
                    'file_type': file_type
                }
                results['gifs'].append(gif)
            except KeyError:
                print 'Could not read content-length header, skipping...'
        else:
            print 'Not a GIF file!'
    results['total'] = len(results['gifs'])
    results['time'] = '%d seconds' % (datetime.now() - start_time).seconds
    return results

if __name__ == '__main__':
    r = praw.Reddit(user_agent='GifCache Image Grabber by billcrystals')
    gifs = scrape_reddit(r)
    print gifs['gifs']
    print gifs['total']
    print gifs['time']