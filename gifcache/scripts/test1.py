allowed = ['.gif', '.gifv', '.webm', '.mp4']
# url = 'http://imgur.com/a/Hftzb'
url = 'http://i.imgur.com/0wx0BUO.gifv'
extension = url[url.rfind('.'):]
print extension
print extension in allowed