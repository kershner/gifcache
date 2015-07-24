test_string = "http://www.image.biz-Here is some text-tags|http://www.image.biz-Here is some text-tag, tagg|http://www.image.biz-Here is some text-tags|http://www.image.biz-Here is some text-|"
values = test_string.split('|')
results = []
for value in values:
    value = value.replace("'", "")
    dash1 = value.find('-')
    dash2 = value.rfind('-')
    img = value[:dash1]
    label = value[dash1 + 1:dash2]
    tags = value[dash2 + 1:].split(',')
    tags_final = []
    for tag in tags:
        tags_final.append(tag.strip())
    results.append([img, label, tags_final])

print results