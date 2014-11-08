from tornado import web, ioloop
import json


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






application = web.Application([
    (r"/", MainHandler),
    (r"/getpatterns", PatternsHandler),
    (r"/getpatterns/([^/]+)", PatternsHandler),
], debug=True)



if __name__ == "__main__":
    application.listen(9001)
    ioloop.IOLoop.instance().start()
