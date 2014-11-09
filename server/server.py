from tornado import web, ioloop
import json
from tornado_cors import CorsMixin



print("Restarted")

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
        tattr = {"title":tach[0]['title'], "desc":tach[0]['desc']}
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
            if user['id'] == uid:
                user["numcompleted"] += 1
                user["completed"].append(aid)

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







application = web.Application([
    (r"/", MainHandler),
    (r"/getpatterns", PatternsHandler),
    (r"/getpatterns/([^/]+)", PatternsHandler),
    (r"/ca/([^/]+)", CompleteAchievement),
    (r"/ca", CompleteAchievement),
    (r"/newuser", NewUser),
], debug=True)



if __name__ == "__main__":
    application.listen(9001)
    ioloop.IOLoop.instance().start()
