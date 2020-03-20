import json
from urllib.request import Request, urlopen
from urllib import parse


def addProvider():
    # Default Cloud Function
    default_func_url = "http://localhost:5001/atb00ker-apps/asia-northeast1/addProvider"
    # Input data
    user_uid = input("Your user authentication UID: ")
    isp_name = input("Name of the provider (eg: BSNL): ")
    icontact = input("Provider contact Information: ")
    iwebsite = input("Provider's website: ")
    pincodes = input("Input list of comma-seperated pincodes"
                     "(eg: 100,101,102): ").split(",")
    func_url = (input(f"Enter your cloud functions URL ({default_func_url}): ")
                or default_func_url)
    # Make requests
    for pincode in pincodes:
        data = {
            "pincode": pincode,
            "uid": user_uid,
            "values": {
                "name": isp_name,
                "contact": icontact,
                "website": iwebsite,
            }
        }
        data = str(json.dumps(data)).encode('utf-8')
        request = Request(func_url, data=data)
        request.add_header('Content-Type', 'application/json')
        try:
            urlopen(request)
        except Exception as error:
            print(error)
        print(f"Adding {isp_name} in {pincode}")


if __name__ == "__main__":
    addProvider()
