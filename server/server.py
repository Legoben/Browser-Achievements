from tornado import web, ioloop
import json
from tornado_cors import CorsMixin
import urlparse
import string
import random

print("Restarted")
def id_generator(size=6, chars=string.ascii_uppercase + string.digits):
            return ''.join(random.choice(chars) for _ in range(size))

class MainHandler(web.RequestHandler):
    def get(self):
        self.write("Browser Achievements!")

class PatternsHandler(web.RequestHandler):
    def get(self, *args, **kwargs):
        self.set_header("Content-Type","application/json")

        url = self.get_argument("url", None)
        if url == None:
            self.write("[]")
            return

        info = json.loads(open("urls.json").read())
        if not url in info:
            self.write('[]')
            return

        newinfo = []
        for ach in info[url]:
            newinfo.append({"pattern":ach['pattern'], "id":ach['id']})

        self.write(json.dumps(newinfo))

class CompleteAchievement(CorsMixin, web.RequestHandler):
    CORS_ORIGIN = '*'

    CORS_HEADERS = 'Content-Type'

    def get(self, *args, **kwargs):

        self.add_header("Content-Type","application/json")
        self.set_header("Access-Control-Allow-Headers", "Content-Type")
        uid = self.get_argument("uid", None)
        aid = self.get_argument("aid", None)
        url = self.get_argument("url", None)

        if url == None or aid == None or uid == None:
            print("None")
            return


        info = json.loads(open("urls.json").read())
        if url not in info:
            return

        tach = [i for i in info[url] if i['id'] == aid]

        if len(tach) == 0:
            return

        if uid in tach[0]['completed_ids']:
            print("got already")
            self.write(json.dumps({"error":"Already got Achievement"}))
            return

        if "image" not in tach[0] or tach[0]['image'] == '':
            print("HERE!")
            tach[0]["image"] = "https://files.helloben.co/upload/uploads/f545f8a88a3a5e.png" #not rick
            #tach[0]["image"] = "https://files.helloben.co/upload/uploads/f545f0f24ea11d.jpg" #rick

        tattr = {"title":tach[0]['title'], "desc":tach[0]['desc'], "image":tach[0]["image"]}
        self.write(json.dumps(tattr))

        self.finish()

        for a in info[url]:
            if a['id'] == aid:
                print(a)
                a['completed_ids'].append(uid)
                a['numcompleted'] += 1

        open("urls.json", "w").write(json.dumps(info))

        users = json.loads(open("users.json").read())

        for user in users:
            print(users[user])

            if user == uid:
                users[user]["numcompleted"] += 1
                users[user]["completed"].append(aid)

        open("users.json", "w").write(json.dumps(users))


class NewUser(web.RequestHandler):
    def get(self, *args, **kwargs):

        print("here")

        uid = self.get_argument("uid", None)
        if uid == None:
            return

        users = json.loads(open("users.json").read())
        users[uid] = {"completed":[],"numcompleted":0}

        open("users.json", "w").write(json.dumps(users))

class GetCount(web.RequestHandler):
    def get(self, *args, **kwargs):
        self.add_header("Content-Type","text/plain")
        url = self.get_argument("url", None)
        if url == None:
            return

        parsed = urlparse.urlparse(url)
        host = parsed.netloc
        #host = url

        if parsed.netloc == "":
            host = url

        print(host)
        info = json.loads(open("urls.json").read())
        if host not in info:
            return

        self.write(str(len(info[host])))

class AddAchievement(CorsMixin,web.RequestHandler):
    CORS_ORIGIN = '*'

    CORS_HEADERS = 'Content-Type'

    def post(self, *args, **kwargs):
        args =["hostname", "pattern", "title", "desc", "image"]
        data = {}

        for a in args:
            data[a] = self.get_argument(a, None)

        tele = {"pattern": data['pattern'], "completed_ids":[],  "numcompleted":0, "id":id_generator(), "title":data["title"], "desc":data["desc"], "image": data['image']}
        print(tele)

        urls = json.loads(open("urls.json").read())

        if data['hostname'] not in urls:
            urls[data['hostname']] = []

        urls[data['hostname']].append(tele)

        open("urls.json", "w").write(json.dumps(urls))

        print("Done!")
        self.write("Done!")





class AForm(web.RequestHandler):
    def get(self, *args, **kwargs):
        self.render("../templates/form.html")




application = web.Application([
    (r"/", MainHandler),
    (r"/getpatterns", PatternsHandler),
    (r"/getpatterns/([^/]+)", PatternsHandler),
    (r"/ca/([^/]+)", CompleteAchievement),
    (r"/ca", CompleteAchievement),
    (r"/newuser", NewUser),
    (r"/newuser/([^/]+)", NewUser),
    (r"/getcount/([^/]+)", GetCount),
    (r"/getcount", GetCount),
    (r"/adda", AddAchievement),
    (r"/adda/([^/]+)", AddAchievement),
    (r"/form", AForm),

], debug=True)



if __name__ == "__main__":
    application.listen(9001)
    ioloop.IOLoop.instance().start()
