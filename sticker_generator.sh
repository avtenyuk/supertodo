#!/bin/bash

############################################# STICKER ##################################################
# StickerApi
curl -i -H "Content-Type: application/json" -X GET -d '{"token": "eed37a8c0ab4a8bf1f403d87aa33990b12f12154"}' http://127.0.0.1:5000/api/sticker
curl -i -H "Content-Type: application/json" -X POST -d '{"token": "eed37a8c0ab4a8bf1f403d87aa33990b12f12154", "title": "SKJDJAKSJDKKJSKKJ", "memo":"many text", "folder_id": 18}' http://127.0.0.1:5000/api/sticker


# OneStickerApi
curl -i -H "Content-Type: application/json" -X GET -d '{"token": "eed37a8c0ab4a8bf1f403d87aa33990b12f12154"}' http://127.0.0.1:5000/api/sticker/10342
curl -i -H "Content-Type: application/json" -X PUT -d '{"token": "eed37a8c0ab4a8bf1f403d87aa33990b12f12154", "title": "JOPA 22222", "memo":"MEMO JOPA"}' http://127.0.0.1:5000/api/sticker/10342
curl -i -H "Content-Type: application/json" -X DELETE -d '{"token": "eed37a8c0ab4a8bf1f403d87aa33990b12f12154"}' http://127.0.0.1:5000/api/sticker/10341

############################################# STICKER ##################################################



############################################# TASK ##################################################
# TaskApi
curl -i -H "Content-Type: application/json" -X GET -d '{"token": "eed37a8c0ab4a8bf1f403d87aa33990b12f12154", "sticker_id": 10342}' http://127.0.0.1:5000/api/task
curl -i -H "Content-Type: application/json" -X POST -d '{"token": "eed37a8c0ab4a8bf1f403d87aa33990b12f12154", "sticker_id": 10342, "text": "task 1"}' http://127.0.0.1:5000/api/task


# OneTaskApi
curl -i -H "Content-Type: application/json" -X GET -d '{"token": "eed37a8c0ab4a8bf1f403d87aa33990b12f12154"}' http://127.0.0.1:5000/api/task/41
curl -i -H "Content-Type: application/json" -X PUT -d '{"token": "eed37a8c0ab4a8bf1f403d87aa33990b12f12154", "text": "news massage here"}' http://127.0.0.1:5000/api/task/41
curl -i -H "Content-Type: application/json" -X DELETE -d '{"token": "eed37a8c0ab4a8bf1f403d87aa33990b12f12154"}' http://127.0.0.1:5000/api/task/41

############################################# TASK ##################################################


############################################# FOLDER ##################################################
#


############################################# FOLDER ##################################################

