# GoGig Intelligent Media Pipeline - Sample API Results
Generated: 2026-08-13 10:27:45 +05:30
Production API: https://gogig-api.onrender.com

> This file contains production API evidence for all three provided sample images plus important edge-case tests.

## 1. Production Health Check

```text
GET https://gogig-api.onrender.com/health

{"status":"UP","timestamp":"2026-08-13T04:58:20.175Z","uptimeSeconds":14,"services":{"database":"UP","redis":"UP"}}
```

## 2. Root Route

```text
GET https://gogig-api.onrender.com/

{"success":false,"error":{"code":"ROUTE_NOT_FOUND","message":"Cannot GET /"}}
```

## 3.1 Sample Image 1 - Upload, Async Status and Result

### Upload
```text
POST https://gogig-api.onrender.com/api/v1/images
-F image=@.\sample-images\sample_1.png

{"success":true,"data":{"processingId":"aa08ba51-71fd-4dea-9b49-aad465f13c1d","status":"pending","originalName":"sample_1.png","size":1604658,"statusUrl":"/api/v1/images/aa08ba51-71fd-4dea-9b49-aad465f13c1d/status","resultUrl":"/api/v1/images/aa08ba51-71fd-4dea-9b49-aad465f13c1d/result"}}
```
Processing ID: aa08ba51-71fd-4dea-9b49-aad465f13c1d
### Status polling
```text
GET https://gogig-api.onrender.com/api/v1/images/aa08ba51-71fd-4dea-9b49-aad465f13c1d/status

{"success":true,"data":{"processingId":"aa08ba51-71fd-4dea-9b49-aad465f13c1d","status":"processing","retryCount":0,"createdAt":"2026-08-13T04:58:28.540Z","processingStartedAt":"2026-08-13T04:58:28.556Z","processingCompletedAt":null,"failureReason":null,"failureCategory":null}}
{"success":true,"data":{"processingId":"aa08ba51-71fd-4dea-9b49-aad465f13c1d","status":"processing","retryCount":0,"createdAt":"2026-08-13T04:58:28.540Z","processingStartedAt":"2026-08-13T04:58:28.556Z","processingCompletedAt":null,"failureReason":null,"failureCategory":null}}
{"success":true,"data":{"processingId":"aa08ba51-71fd-4dea-9b49-aad465f13c1d","status":"processing","retryCount":0,"createdAt":"2026-08-13T04:58:28.540Z","processingStartedAt":"2026-08-13T04:58:28.556Z","processingCompletedAt":null,"failureReason":null,"failureCategory":null}}
{"success":true,"data":{"processingId":"aa08ba51-71fd-4dea-9b49-aad465f13c1d","status":"processing","retryCount":0,"createdAt":"2026-08-13T04:58:28.540Z","processingStartedAt":"2026-08-13T04:58:28.556Z","processingCompletedAt":null,"failureReason":null,"failureCategory":null}}
{"success":true,"data":{"processingId":"aa08ba51-71fd-4dea-9b49-aad465f13c1d","status":"processing","retryCount":0,"createdAt":"2026-08-13T04:58:28.540Z","processingStartedAt":"2026-08-13T04:58:28.556Z","processingCompletedAt":null,"failureReason":null,"failureCategory":null}}
{"success":true,"data":{"processingId":"aa08ba51-71fd-4dea-9b49-aad465f13c1d","status":"processing","retryCount":0,"createdAt":"2026-08-13T04:58:28.540Z","processingStartedAt":"2026-08-13T04:58:28.556Z","processingCompletedAt":null,"failureReason":null,"failureCategory":null}}
{"success":true,"data":{"processingId":"aa08ba51-71fd-4dea-9b49-aad465f13c1d","status":"processing","retryCount":0,"createdAt":"2026-08-13T04:58:28.540Z","processingStartedAt":"2026-08-13T04:58:28.556Z","processingCompletedAt":null,"failureReason":null,"failureCategory":null}}
{"success":true,"data":{"processingId":"aa08ba51-71fd-4dea-9b49-aad465f13c1d","status":"processing","retryCount":0,"createdAt":"2026-08-13T04:58:28.540Z","processingStartedAt":"2026-08-13T04:58:28.556Z","processingCompletedAt":null,"failureReason":null,"failureCategory":null}}
{"success":true,"data":{"processingId":"aa08ba51-71fd-4dea-9b49-aad465f13c1d","status":"processing","retryCount":0,"createdAt":"2026-08-13T04:58:28.540Z","processingStartedAt":"2026-08-13T04:58:28.556Z","processingCompletedAt":null,"failureReason":null,"failureCategory":null}}
{"success":true,"data":{"processingId":"aa08ba51-71fd-4dea-9b49-aad465f13c1d","status":"processing","retryCount":0,"createdAt":"2026-08-13T04:58:28.540Z","processingStartedAt":"2026-08-13T04:58:28.556Z","processingCompletedAt":null,"failureReason":null,"failureCategory":null}}
{"success":true,"data":{"processingId":"aa08ba51-71fd-4dea-9b49-aad465f13c1d","status":"processing","retryCount":0,"createdAt":"2026-08-13T04:58:28.540Z","processingStartedAt":"2026-08-13T04:58:28.556Z","processingCompletedAt":null,"failureReason":null,"failureCategory":null}}
{"success":true,"data":{"processingId":"aa08ba51-71fd-4dea-9b49-aad465f13c1d","status":"processing","retryCount":0,"createdAt":"2026-08-13T04:58:28.540Z","processingStartedAt":"2026-08-13T04:58:28.556Z","processingCompletedAt":null,"failureReason":null,"failureCategory":null}}
{"success":true,"data":{"processingId":"aa08ba51-71fd-4dea-9b49-aad465f13c1d","status":"processing","retryCount":0,"createdAt":"2026-08-13T04:58:28.540Z","processingStartedAt":"2026-08-13T04:58:28.556Z","processingCompletedAt":null,"failureReason":null,"failureCategory":null}}
{"success":true,"data":{"processingId":"aa08ba51-71fd-4dea-9b49-aad465f13c1d","status":"processing","retryCount":0,"createdAt":"2026-08-13T04:58:28.540Z","processingStartedAt":"2026-08-13T04:58:28.556Z","processingCompletedAt":null,"failureReason":null,"failureCategory":null}}
{"success":true,"data":{"processingId":"aa08ba51-71fd-4dea-9b49-aad465f13c1d","status":"completed","retryCount":0,"createdAt":"2026-08-13T04:58:28.540Z","processingStartedAt":"2026-08-13T04:58:28.556Z","processingCompletedAt":"2026-08-13T04:59:09.397Z","failureReason":null,"failureCategory":null}}
```
### Final Result
```text
GET https://gogig-api.onrender.com/api/v1/images/aa08ba51-71fd-4dea-9b49-aad465f13c1d/result

{"success":true,"data":{"image":{"size":1604658,"hashes":{"sha256":"253dd760fc20ff3c53178b8f883a85006eed55d7891bd9827d10b062bd278d1c","perceptualHash":"001f07037fe07ff0fee0ffc0fe00c600dfffc3b9c0007c0079e0fc00df018fc3"},"mimeType":"image/png","dimensions":{"space":"srgb","width":720,"height":1280,"density":72,"channels":4},"originalName":"sample_1.png"},"checks":{"ocr":{"message":"Extracted 82 words via OCR (Confidence: 32.0%)","rawText":"PC NE\nii rope  /\nwig #\nSERRE\na : /\nol Lg ion\nEY CaF E00 ty oy ]\nRY [A (Wr y\nj a Ce EATIVITY ;\nEr a 2 TUE) i\nSl. LI\nNE\nl h a -GÇöGÇöGÇö\n& a Sa 4\nLSS a ~ A O A\n\\ C CT =O) fre) -ó 4 /\nRNC lig Vy\ny % Y 3 = /\nI Ba\nii |\n| Es\nIn| % \\\nI &\n / ; Rs","analyzer":"ocr","wordCount":82,"confidence":32,"sampleWords":[{"text":"PC","confidence":35.99917602539062},{"text":"NE","confidence":37.32379913330078},{"text":"ii","confidence":25.69277954101562},{"text":"rope","confidence":45.11372375488281},{"text":" /","confidence":16.31289672851562},{"text":"wig","confidence":38.57015991210938},{"text":"#","confidence":35.84585571289062},{"text":"SERRE","confidence":0},{"text":"a","confidence":36.16714477539062},{"text":":","confidence":21.07098388671875}]},"blur":{"message":"Image sharpness is acceptable (Laplacian variance: 1032)","analyzer":"blur","isBlurry":false,"threshold":40,"confidence":0.9,"qualityRating":"sharp","laplacianVariance":1032},"metadata":{"gps":null,"device":{"make":null,"model":null,"software":null},"format":"png","hasExif":false,"message":"No camera EXIF metadata present","analyzer":"metadata","createDate":null,"dimensions":{"space":"srgb","width":720,"height":1280,"density":72,"channels":4}},"duplicate":{"sha256":"253dd760fc20ff3c53178b8f883a85006eed55d7891bd9827d10b062bd278d1c","message":"Duplicate image detected (EXACT_HASH_MATCH, matching ID: 0e891a53-b401-4f6c-bed0-6f9066820fc0)","analyzer":"duplicate","isDuplicate":true,"duplicateType":"EXACT_HASH_MATCH","perceptualHash":"001f07037fe07ff0fee0ffc0fe00c600dfffc3b9c0007c0079e0fc00df018fc3","matchingImageId":"0e891a53-b401-4f6c-bed0-6f9066820fc0","minHammingDistance":null},"tampering":{"message":"No explicit tampering signatures identified","analyzer":"tamper","indicators":[],"isTampered":false,"tamperScore":0,"detectedEditor":null},"brightness":{"message":"Lighting is optimal (Mean luminance: 107.9/255)","analyzer":"brightness","darkRatio":0.13,"confidence":0.92,"isLowLight":false,"brightRatio":0.03,"isOverexposed":false,"meanLuminance":107.9,"brightnessState":"normal"},"screenshot":{"message":"Original camera capture verified (No screenshot indicators)","reasons":["Aspect ratio (1.78) matches common mobile/desktop display standard without camera EXIF","PNG format lacking digital camera metadata"],"analyzer":"screenshot","isScreenshot":false,"confidenceScore":40},"licensePlate":{"message":"No valid Indian license plate format identified in OCR text","analyzer":"plate","confidence":0,"primaryPlate":null,"hasValidPlate":false,"detectedPlates":[]}},"status":"completed","vehicle":{"vehicleType":"Auto-Rickshaw","licensePlate":"MH12KR1145","plateDetails":null,"licensePlateValid":false,"makeModelCandidate":"Bajaj RE"},"aiAnalysis":{"enabled":true,"analysis":{"vehicleType":"Auto-Rickshaw","isPhotoOfPhoto":false,"confidenceScore":0.98,"keyObservations":["Vehicle is an auto-rickshaw with a large advertising banner covering its rear.","The banner advertises 'ARENA ANIMATION' and shows 'PUNE-FC ROAD' along with a contact number '7755900813'.","An 'RE' badge is visible on the rear panel, indicating a Bajaj RE model.","The yellow rear bumper/fender shows significant paint chipping and wear.","The license plate is an Indian format plate with 'IND' embossed."],"plateLegibility":"Clear","licensePlateText":"MH12KR1145","overallCondition":"Minor Damage","makeModelCandidate":"Bajaj RE"},"modelUsed":"gemini-2.5-flash","aiProcessed":true},"durationMs":40837,"processedAt":"2026-08-13T04:59:09.397Z","processingId":"aa08ba51-71fd-4dea-9b49-aad465f13c1d","overallAssessment":{"flags":["DUPLICATE_IMAGE"],"qualityScore":70,"recommendation":"REJECT","passedVerification":false}}}
```

## 3.2 Sample Image 2 - Upload, Async Status and Result

### Upload
```text
POST https://gogig-api.onrender.com/api/v1/images
-F image=@.\sample-images\sample_2.png

{"success":true,"data":{"processingId":"dbaa7728-8ac0-43f4-8f7d-ce4ad79b86d8","status":"pending","originalName":"sample_2.png","size":2330976,"statusUrl":"/api/v1/images/dbaa7728-8ac0-43f4-8f7d-ce4ad79b86d8/status","resultUrl":"/api/v1/images/dbaa7728-8ac0-43f4-8f7d-ce4ad79b86d8/result"}}
```
Processing ID: dbaa7728-8ac0-43f4-8f7d-ce4ad79b86d8
### Status polling
```text
GET https://gogig-api.onrender.com/api/v1/images/dbaa7728-8ac0-43f4-8f7d-ce4ad79b86d8/status

{"success":true,"data":{"processingId":"dbaa7728-8ac0-43f4-8f7d-ce4ad79b86d8","status":"processing","retryCount":0,"createdAt":"2026-08-13T04:59:22.892Z","processingStartedAt":"2026-08-13T04:59:22.905Z","processingCompletedAt":null,"failureReason":null,"failureCategory":null}}
{"success":true,"data":{"processingId":"dbaa7728-8ac0-43f4-8f7d-ce4ad79b86d8","status":"processing","retryCount":0,"createdAt":"2026-08-13T04:59:22.892Z","processingStartedAt":"2026-08-13T04:59:22.905Z","processingCompletedAt":null,"failureReason":null,"failureCategory":null}}
{"success":true,"data":{"processingId":"dbaa7728-8ac0-43f4-8f7d-ce4ad79b86d8","status":"processing","retryCount":0,"createdAt":"2026-08-13T04:59:22.892Z","processingStartedAt":"2026-08-13T04:59:22.905Z","processingCompletedAt":null,"failureReason":null,"failureCategory":null}}
{"success":true,"data":{"processingId":"dbaa7728-8ac0-43f4-8f7d-ce4ad79b86d8","status":"processing","retryCount":0,"createdAt":"2026-08-13T04:59:22.892Z","processingStartedAt":"2026-08-13T04:59:22.905Z","processingCompletedAt":null,"failureReason":null,"failureCategory":null}}
{"success":true,"data":{"processingId":"dbaa7728-8ac0-43f4-8f7d-ce4ad79b86d8","status":"processing","retryCount":0,"createdAt":"2026-08-13T04:59:22.892Z","processingStartedAt":"2026-08-13T04:59:22.905Z","processingCompletedAt":null,"failureReason":null,"failureCategory":null}}
{"success":true,"data":{"processingId":"dbaa7728-8ac0-43f4-8f7d-ce4ad79b86d8","status":"processing","retryCount":0,"createdAt":"2026-08-13T04:59:22.892Z","processingStartedAt":"2026-08-13T04:59:22.905Z","processingCompletedAt":null,"failureReason":null,"failureCategory":null}}
{"success":true,"data":{"processingId":"dbaa7728-8ac0-43f4-8f7d-ce4ad79b86d8","status":"processing","retryCount":0,"createdAt":"2026-08-13T04:59:22.892Z","processingStartedAt":"2026-08-13T04:59:22.905Z","processingCompletedAt":null,"failureReason":null,"failureCategory":null}}
{"success":true,"data":{"processingId":"dbaa7728-8ac0-43f4-8f7d-ce4ad79b86d8","status":"processing","retryCount":0,"createdAt":"2026-08-13T04:59:22.892Z","processingStartedAt":"2026-08-13T04:59:22.905Z","processingCompletedAt":null,"failureReason":null,"failureCategory":null}}
{"success":true,"data":{"processingId":"dbaa7728-8ac0-43f4-8f7d-ce4ad79b86d8","status":"processing","retryCount":0,"createdAt":"2026-08-13T04:59:22.892Z","processingStartedAt":"2026-08-13T04:59:22.905Z","processingCompletedAt":null,"failureReason":null,"failureCategory":null}}
{"success":true,"data":{"processingId":"dbaa7728-8ac0-43f4-8f7d-ce4ad79b86d8","status":"processing","retryCount":0,"createdAt":"2026-08-13T04:59:22.892Z","processingStartedAt":"2026-08-13T04:59:22.905Z","processingCompletedAt":null,"failureReason":null,"failureCategory":null}}
{"success":true,"data":{"processingId":"dbaa7728-8ac0-43f4-8f7d-ce4ad79b86d8","status":"processing","retryCount":0,"createdAt":"2026-08-13T04:59:22.892Z","processingStartedAt":"2026-08-13T04:59:22.905Z","processingCompletedAt":null,"failureReason":null,"failureCategory":null}}
{"success":true,"data":{"processingId":"dbaa7728-8ac0-43f4-8f7d-ce4ad79b86d8","status":"processing","retryCount":0,"createdAt":"2026-08-13T04:59:22.892Z","processingStartedAt":"2026-08-13T04:59:22.905Z","processingCompletedAt":null,"failureReason":null,"failureCategory":null}}
{"success":true,"data":{"processingId":"dbaa7728-8ac0-43f4-8f7d-ce4ad79b86d8","status":"processing","retryCount":0,"createdAt":"2026-08-13T04:59:22.892Z","processingStartedAt":"2026-08-13T04:59:22.905Z","processingCompletedAt":null,"failureReason":null,"failureCategory":null}}
{"success":true,"data":{"processingId":"dbaa7728-8ac0-43f4-8f7d-ce4ad79b86d8","status":"processing","retryCount":0,"createdAt":"2026-08-13T04:59:22.892Z","processingStartedAt":"2026-08-13T04:59:22.905Z","processingCompletedAt":null,"failureReason":null,"failureCategory":null}}
{"success":true,"data":{"processingId":"dbaa7728-8ac0-43f4-8f7d-ce4ad79b86d8","status":"processing","retryCount":0,"createdAt":"2026-08-13T04:59:22.892Z","processingStartedAt":"2026-08-13T04:59:22.905Z","processingCompletedAt":null,"failureReason":null,"failureCategory":null}}
{"success":true,"data":{"processingId":"dbaa7728-8ac0-43f4-8f7d-ce4ad79b86d8","status":"processing","retryCount":0,"createdAt":"2026-08-13T04:59:22.892Z","processingStartedAt":"2026-08-13T04:59:22.905Z","processingCompletedAt":null,"failureReason":null,"failureCategory":null}}
{"success":true,"data":{"processingId":"dbaa7728-8ac0-43f4-8f7d-ce4ad79b86d8","status":"processing","retryCount":0,"createdAt":"2026-08-13T04:59:22.892Z","processingStartedAt":"2026-08-13T04:59:22.905Z","processingCompletedAt":null,"failureReason":null,"failureCategory":null}}
{"success":true,"data":{"processingId":"dbaa7728-8ac0-43f4-8f7d-ce4ad79b86d8","status":"completed","retryCount":0,"createdAt":"2026-08-13T04:59:22.892Z","processingStartedAt":"2026-08-13T04:59:22.905Z","processingCompletedAt":"2026-08-13T05:00:08.656Z","failureReason":null,"failureCategory":null}}
```
### Final Result
```text
GET https://gogig-api.onrender.com/api/v1/images/dbaa7728-8ac0-43f4-8f7d-ce4ad79b86d8/result

{"success":true,"data":{"image":{"size":2330976,"hashes":{"sha256":"2b9cd555415dbae56d4653a8dcf7c50170443a4817df67ec99805315ac5eafe9","perceptualHash":"ffd8e1f0203800bf0c07c41e00ffe0ffe0ff207f1077100ff87ffe1ce0041c03"},"mimeType":"image/png","dimensions":{"space":"srgb","width":960,"height":1280,"density":72,"channels":4},"originalName":"sample_2.png"},"checks":{"ocr":{"message":"Extracted 202 words via OCR (Confidence: 42.0%)","rawText":"- =F i ass] =\nie | f I = i\n: GÇö [P= VPSVSOENTADCINC -¬ 8 [a oe g\nMee DOPAMINE [5 El Lally dai Gé¼ b [9425 {\nk REN Po hd Jill :\nGÇö . as 4 = oa on 88, EH , UB Rl\nx iy hear i ENING\nNT I -¬ 0500020008 ) Be\n| \\ AT i b\n= Zi A GÇ¥ | -Ñ\nGÇö >\nIE: [4/8\nST AP :\nJ 5 -+ GÇö DrAg se da i\n3 GÇö pans >\n\\ : pe855! - 11160 v 2\na PLL)\nae -+ [luass=GÇö\"\" _ = #\n| \\_8 Z il\nAS 2  _ ,\nol NRRL INNS bi GÇ£= -º :\na SY = = CA\ny oy UA 3 a) =,\n- ay\nPP A | -¬ = =\n> 4 \\ | ~\nrv is A x )- g ch Soe\nGÇ¥- ; aw 5 . : -¬ o Re\nE Tuesday, 17 Feb 2026 11:22 AM\n= Perambur High Road, CMWSSB Division 70, Perambur, Ward 70, Zone 6 Thiru. Vi.\nEi wily Ka. Nagar, Chennai Corporation, Chennai, Tamil Nadu, 600011, India\ny Lat: 13.1059115 | Long: 80.2514811\nTASK ID: 22FUGV4G2K glcig|","analyzer":"ocr","wordCount":202,"confidence":42,"sampleWords":[{"text":"-","confidence":53.18848037719727},{"text":"=F","confidence":30.04706573486328},{"text":"i","confidence":14.6134033203125},{"text":"ass]","confidence":0},{"text":"=","confidence":49.58999633789062},{"text":"ie","confidence":25.41327667236328},{"text":"|","confidence":36.03546905517578},{"text":"f","confidence":0},{"text":"I","confidence":25.34774780273438},{"text":"=","confidence":62.71862411499023}]},"blur":{"message":"Image sharpness is acceptable (Laplacian variance: 2572.49)","analyzer":"blur","isBlurry":false,"threshold":40,"confidence":0.9,"qualityRating":"sharp","laplacianVariance":2572.49},"metadata":{"gps":null,"device":{"make":null,"model":null,"software":null},"format":"png","hasExif":false,"message":"No camera EXIF metadata present","analyzer":"metadata","createDate":null,"dimensions":{"space":"srgb","width":960,"height":1280,"density":72,"channels":4}},"duplicate":{"sha256":"2b9cd555415dbae56d4653a8dcf7c50170443a4817df67ec99805315ac5eafe9","message":"Duplicate image detected (EXACT_HASH_MATCH, matching ID: 73beb5b5-641e-4e89-8a04-404e22adb2fa)","analyzer":"duplicate","isDuplicate":true,"duplicateType":"EXACT_HASH_MATCH","perceptualHash":"ffd8e1f0203800bf0c07c41e00ffe0ffe0ff207f1077100ff87ffe1ce0041c03","matchingImageId":"73beb5b5-641e-4e89-8a04-404e22adb2fa","minHammingDistance":null},"tampering":{"message":"No explicit tampering signatures identified","analyzer":"tamper","indicators":[],"isTampered":false,"tamperScore":0,"detectedEditor":null},"brightness":{"message":"Lighting is optimal (Mean luminance: 124.64/255)","analyzer":"brightness","darkRatio":0.04,"confidence":0.92,"isLowLight":false,"brightRatio":0.07,"isOverexposed":false,"meanLuminance":124.64,"brightnessState":"normal"},"screenshot":{"message":"Original camera capture verified (No screenshot indicators)","reasons":["Aspect ratio (1.33) matches common mobile/desktop display standard without camera EXIF","PNG format lacking digital camera metadata"],"analyzer":"screenshot","isScreenshot":false,"confidenceScore":40},"licensePlate":{"message":"No valid Indian license plate format identified in OCR text","analyzer":"plate","confidence":0,"primaryPlate":null,"hasValidPlate":false,"detectedPlates":[]}},"status":"completed","vehicle":{"vehicleType":"Auto-Rickshaw","licensePlate":"TN 05 BT 5754","plateDetails":null,"licensePlateValid":false,"makeModelCandidate":"Bajaj RE"},"aiAnalysis":{"enabled":true,"analysis":{"vehicleType":"Auto-Rickshaw","isPhotoOfPhoto":false,"confidenceScore":0.98,"keyObservations":["Vehicle is a three-wheeled auto-rickshaw, commonly found in India.","The vehicle features prominent blue advertising for 'Dr Agarwals Eye Hospital' on its canopy.","License plate 'TN 05 BT 5754' is clearly visible on the rear.","An 'LPG' sticker is visible near the license plate, indicating fuel type.","The vehicle shows signs of wear and tear, including scuffs and scratches on the body panels and rear fender."],"plateLegibility":"Clear","licensePlateText":"TN 05 BT 5754","overallCondition":"Minor Damage","makeModelCandidate":"Bajaj RE"},"modelUsed":"gemini-2.5-flash","aiProcessed":true},"durationMs":45748,"processedAt":"2026-08-13T05:00:08.656Z","processingId":"dbaa7728-8ac0-43f4-8f7d-ce4ad79b86d8","overallAssessment":{"flags":["DUPLICATE_IMAGE"],"qualityScore":70,"recommendation":"REJECT","passedVerification":false}}}
```

## 3.3 Sample Image 3 - Upload, Async Status and Result

### Upload
```text
POST https://gogig-api.onrender.com/api/v1/images
-F image=@.\sample-images\sample_3.png

{"success":true,"data":{"processingId":"d515d8ff-36b1-48d7-90c3-1caedcb6aad6","status":"pending","originalName":"sample_3.png","size":1820361,"statusUrl":"/api/v1/images/d515d8ff-36b1-48d7-90c3-1caedcb6aad6/status","resultUrl":"/api/v1/images/d515d8ff-36b1-48d7-90c3-1caedcb6aad6/result"}}
```
Processing ID: d515d8ff-36b1-48d7-90c3-1caedcb6aad6
### Status polling
```text
GET https://gogig-api.onrender.com/api/v1/images/d515d8ff-36b1-48d7-90c3-1caedcb6aad6/status

{"success":true,"data":{"processingId":"d515d8ff-36b1-48d7-90c3-1caedcb6aad6","status":"processing","retryCount":0,"createdAt":"2026-08-13T05:00:22.212Z","processingStartedAt":"2026-08-13T05:00:22.223Z","processingCompletedAt":null,"failureReason":null,"failureCategory":null}}
{"success":true,"data":{"processingId":"d515d8ff-36b1-48d7-90c3-1caedcb6aad6","status":"processing","retryCount":0,"createdAt":"2026-08-13T05:00:22.212Z","processingStartedAt":"2026-08-13T05:00:22.223Z","processingCompletedAt":null,"failureReason":null,"failureCategory":null}}
{"success":true,"data":{"processingId":"d515d8ff-36b1-48d7-90c3-1caedcb6aad6","status":"processing","retryCount":0,"createdAt":"2026-08-13T05:00:22.212Z","processingStartedAt":"2026-08-13T05:00:22.223Z","processingCompletedAt":null,"failureReason":null,"failureCategory":null}}
{"success":true,"data":{"processingId":"d515d8ff-36b1-48d7-90c3-1caedcb6aad6","status":"processing","retryCount":0,"createdAt":"2026-08-13T05:00:22.212Z","processingStartedAt":"2026-08-13T05:00:22.223Z","processingCompletedAt":null,"failureReason":null,"failureCategory":null}}
{"success":true,"data":{"processingId":"d515d8ff-36b1-48d7-90c3-1caedcb6aad6","status":"processing","retryCount":0,"createdAt":"2026-08-13T05:00:22.212Z","processingStartedAt":"2026-08-13T05:00:22.223Z","processingCompletedAt":null,"failureReason":null,"failureCategory":null}}
{"success":true,"data":{"processingId":"d515d8ff-36b1-48d7-90c3-1caedcb6aad6","status":"processing","retryCount":0,"createdAt":"2026-08-13T05:00:22.212Z","processingStartedAt":"2026-08-13T05:00:22.223Z","processingCompletedAt":null,"failureReason":null,"failureCategory":null}}
{"success":true,"data":{"processingId":"d515d8ff-36b1-48d7-90c3-1caedcb6aad6","status":"processing","retryCount":0,"createdAt":"2026-08-13T05:00:22.212Z","processingStartedAt":"2026-08-13T05:00:22.223Z","processingCompletedAt":null,"failureReason":null,"failureCategory":null}}
{"success":true,"data":{"processingId":"d515d8ff-36b1-48d7-90c3-1caedcb6aad6","status":"processing","retryCount":0,"createdAt":"2026-08-13T05:00:22.212Z","processingStartedAt":"2026-08-13T05:00:22.223Z","processingCompletedAt":null,"failureReason":null,"failureCategory":null}}
{"success":true,"data":{"processingId":"d515d8ff-36b1-48d7-90c3-1caedcb6aad6","status":"processing","retryCount":0,"createdAt":"2026-08-13T05:00:22.212Z","processingStartedAt":"2026-08-13T05:00:22.223Z","processingCompletedAt":null,"failureReason":null,"failureCategory":null}}
{"success":true,"data":{"processingId":"d515d8ff-36b1-48d7-90c3-1caedcb6aad6","status":"processing","retryCount":0,"createdAt":"2026-08-13T05:00:22.212Z","processingStartedAt":"2026-08-13T05:00:22.223Z","processingCompletedAt":null,"failureReason":null,"failureCategory":null}}
{"success":true,"data":{"processingId":"d515d8ff-36b1-48d7-90c3-1caedcb6aad6","status":"processing","retryCount":0,"createdAt":"2026-08-13T05:00:22.212Z","processingStartedAt":"2026-08-13T05:00:22.223Z","processingCompletedAt":null,"failureReason":null,"failureCategory":null}}
{"success":true,"data":{"processingId":"d515d8ff-36b1-48d7-90c3-1caedcb6aad6","status":"processing","retryCount":0,"createdAt":"2026-08-13T05:00:22.212Z","processingStartedAt":"2026-08-13T05:00:22.223Z","processingCompletedAt":null,"failureReason":null,"failureCategory":null}}
{"success":true,"data":{"processingId":"d515d8ff-36b1-48d7-90c3-1caedcb6aad6","status":"processing","retryCount":0,"createdAt":"2026-08-13T05:00:22.212Z","processingStartedAt":"2026-08-13T05:00:22.223Z","processingCompletedAt":null,"failureReason":null,"failureCategory":null}}
{"success":true,"data":{"processingId":"d515d8ff-36b1-48d7-90c3-1caedcb6aad6","status":"processing","retryCount":0,"createdAt":"2026-08-13T05:00:22.212Z","processingStartedAt":"2026-08-13T05:00:22.223Z","processingCompletedAt":null,"failureReason":null,"failureCategory":null}}
{"success":true,"data":{"processingId":"d515d8ff-36b1-48d7-90c3-1caedcb6aad6","status":"processing","retryCount":0,"createdAt":"2026-08-13T05:00:22.212Z","processingStartedAt":"2026-08-13T05:00:22.223Z","processingCompletedAt":null,"failureReason":null,"failureCategory":null}}
{"success":true,"data":{"processingId":"d515d8ff-36b1-48d7-90c3-1caedcb6aad6","status":"processing","retryCount":0,"createdAt":"2026-08-13T05:00:22.212Z","processingStartedAt":"2026-08-13T05:00:22.223Z","processingCompletedAt":null,"failureReason":null,"failureCategory":null}}
{"success":true,"data":{"processingId":"d515d8ff-36b1-48d7-90c3-1caedcb6aad6","status":"processing","retryCount":0,"createdAt":"2026-08-13T05:00:22.212Z","processingStartedAt":"2026-08-13T05:00:22.223Z","processingCompletedAt":null,"failureReason":null,"failureCategory":null}}
{"success":true,"data":{"processingId":"d515d8ff-36b1-48d7-90c3-1caedcb6aad6","status":"processing","retryCount":0,"createdAt":"2026-08-13T05:00:22.212Z","processingStartedAt":"2026-08-13T05:00:22.223Z","processingCompletedAt":null,"failureReason":null,"failureCategory":null}}
{"success":true,"data":{"processingId":"d515d8ff-36b1-48d7-90c3-1caedcb6aad6","status":"processing","retryCount":0,"createdAt":"2026-08-13T05:00:22.212Z","processingStartedAt":"2026-08-13T05:00:22.223Z","processingCompletedAt":null,"failureReason":null,"failureCategory":null}}
{"success":true,"data":{"processingId":"d515d8ff-36b1-48d7-90c3-1caedcb6aad6","status":"processing","retryCount":0,"createdAt":"2026-08-13T05:00:22.212Z","processingStartedAt":"2026-08-13T05:00:22.223Z","processingCompletedAt":null,"failureReason":null,"failureCategory":null}}
{"success":true,"data":{"processingId":"d515d8ff-36b1-48d7-90c3-1caedcb6aad6","status":"processing","retryCount":0,"createdAt":"2026-08-13T05:00:22.212Z","processingStartedAt":"2026-08-13T05:00:22.223Z","processingCompletedAt":null,"failureReason":null,"failureCategory":null}}
{"success":true,"data":{"processingId":"d515d8ff-36b1-48d7-90c3-1caedcb6aad6","status":"processing","retryCount":0,"createdAt":"2026-08-13T05:00:22.212Z","processingStartedAt":"2026-08-13T05:00:22.223Z","processingCompletedAt":null,"failureReason":null,"failureCategory":null}}
{"success":true,"data":{"processingId":"d515d8ff-36b1-48d7-90c3-1caedcb6aad6","status":"processing","retryCount":0,"createdAt":"2026-08-13T05:00:22.212Z","processingStartedAt":"2026-08-13T05:00:22.223Z","processingCompletedAt":null,"failureReason":null,"failureCategory":null}}
{"success":true,"data":{"processingId":"d515d8ff-36b1-48d7-90c3-1caedcb6aad6","status":"processing","retryCount":0,"createdAt":"2026-08-13T05:00:22.212Z","processingStartedAt":"2026-08-13T05:00:22.223Z","processingCompletedAt":null,"failureReason":null,"failureCategory":null}}
{"success":true,"data":{"processingId":"d515d8ff-36b1-48d7-90c3-1caedcb6aad6","status":"processing","retryCount":0,"createdAt":"2026-08-13T05:00:22.212Z","processingStartedAt":"2026-08-13T05:00:22.223Z","processingCompletedAt":null,"failureReason":null,"failureCategory":null}}
{"success":true,"data":{"processingId":"d515d8ff-36b1-48d7-90c3-1caedcb6aad6","status":"processing","retryCount":0,"createdAt":"2026-08-13T05:00:22.212Z","processingStartedAt":"2026-08-13T05:00:22.223Z","processingCompletedAt":null,"failureReason":null,"failureCategory":null}}
{"success":true,"data":{"processingId":"d515d8ff-36b1-48d7-90c3-1caedcb6aad6","status":"processing","retryCount":0,"createdAt":"2026-08-13T05:00:22.212Z","processingStartedAt":"2026-08-13T05:00:22.223Z","processingCompletedAt":null,"failureReason":null,"failureCategory":null}}
{"success":true,"data":{"processingId":"d515d8ff-36b1-48d7-90c3-1caedcb6aad6","status":"processing","retryCount":0,"createdAt":"2026-08-13T05:00:22.212Z","processingStartedAt":"2026-08-13T05:00:22.223Z","processingCompletedAt":null,"failureReason":null,"failureCategory":null}}
{"success":true,"data":{"processingId":"d515d8ff-36b1-48d7-90c3-1caedcb6aad6","status":"processing","retryCount":0,"createdAt":"2026-08-13T05:00:22.212Z","processingStartedAt":"2026-08-13T05:00:22.223Z","processingCompletedAt":null,"failureReason":null,"failureCategory":null}}
{"success":true,"data":{"processingId":"d515d8ff-36b1-48d7-90c3-1caedcb6aad6","status":"processing","retryCount":0,"createdAt":"2026-08-13T05:00:22.212Z","processingStartedAt":"2026-08-13T05:00:22.223Z","processingCompletedAt":null,"failureReason":null,"failureCategory":null}}
{"success":true,"data":{"processingId":"d515d8ff-36b1-48d7-90c3-1caedcb6aad6","status":"processing","retryCount":0,"createdAt":"2026-08-13T05:00:22.212Z","processingStartedAt":"2026-08-13T05:00:22.223Z","processingCompletedAt":null,"failureReason":null,"failureCategory":null}}
{"success":true,"data":{"processingId":"d515d8ff-36b1-48d7-90c3-1caedcb6aad6","status":"completed","retryCount":0,"createdAt":"2026-08-13T05:00:22.212Z","processingStartedAt":"2026-08-13T05:00:22.223Z","processingCompletedAt":"2026-08-13T05:01:38.764Z","failureReason":null,"failureCategory":null}}
```
### Final Result
```text
GET https://gogig-api.onrender.com/api/v1/images/d515d8ff-36b1-48d7-90c3-1caedcb6aad6/result

{"success":true,"data":{"image":{"size":1820361,"hashes":{"sha256":"1f034d20bc1fa3a5534d05624dd70d852bf17fcf41a89a3da6af6cb64bc02ed3","perceptualHash":"00ff007f80ff03e30ff303f433fb000b827f801fc7ff8003c00707ff007f00ff"},"mimeType":"image/png","dimensions":{"space":"srgb","width":720,"height":1280,"density":72,"channels":4},"originalName":"sample_3.png"},"checks":{"ocr":{"message":"Extracted 260 words via OCR (Confidence: 25.0%)","rawText":"ARR = FW SOE\n\niE EREUN NG E -ú\n\naR IN, TRA 2S ;\nWY Bhat No TN EH NS 3 -ó\nx Ww y HN WN Prin ~y I y (I 8\nso oN dt on\n\nFe Tea\nCSS SEO a B\n\\ - a ma? |\n) \\y (Ihde\nar ), SE\nCV meNEsFcROAD :\nLs [DESO] 7755900813 |=\nCAN) aaa . 3 as\nFIRE PRY: ARENA iy\nHE a SEE\nsa) =r) =\n= WM od A) sftoerafe,\n\n: AS Veg |\n\nvo dy Cael cpenmyiry\n> ES -¬ vy 5 9\nFn |g TN NES wit\nI 5 Lai GLOBAL ALUMNI 1 Eee ar |\na a memos corer ff J)\nJ+ RECRUITERS GÇöGÇöGÇö -\n\n. gl]\noi | - SeGÇö =\nio = SeGÇöGÇö ( f\n: : 3 GÇÿ-¬. 0\nv (Bi (rs\n\nmmm aww ann] |\niE Fro ig LSS Ie | 2N'}\n\na -¬ GÇö in\ng -+ 7 GÇÖ i i\nje: 2 -º\n\n\\ SA fo\ni Cs SE\nah 2 LAT Re ha CORTE ae i ON ER\nSen IEE a Ri SNARES\nfa. add A At CONN\n\n\" 0 Es EAR b WE on Sa\nPons CT TER CUSERNER\na pss / Bl adie os Be\nBT fr Bal is a aly PREIS\n\ngn -Ñ bie is Hh fio <n EAH\n\nCi: a ER Cl CS IRE\nPAE SARE eg fA\nheels DR REE cd\n6. TT Kila YUH AE deems HR, Ae\nPp CEES Een ee Re Ree\na SE A rR RN\nJ ERE 2 LT","analyzer":"ocr","wordCount":260,"confidence":25,"sampleWords":[{"text":"ARR","confidence":8.474662780761719},{"text":"=","confidence":0},{"text":"FW","confidence":13.126708984375},{"text":"SOE","confidence":40.84247207641602},{"text":"iE","confidence":14.05204010009766},{"text":"EREUN","confidence":0},{"text":"NG","confidence":25.75706481933594},{"text":"E","confidence":0},{"text":"-ú","confidence":32.85647583007812},{"text":"aR","confidence":24.83654022216797}]},"blur":{"message":"Image sharpness is acceptable (Laplacian variance: 2389.49)","analyzer":"blur","isBlurry":false,"threshold":40,"confidence":0.9,"qualityRating":"sharp","laplacianVariance":2389.49},"metadata":{"gps":null,"device":{"make":null,"model":null,"software":null},"format":"png","hasExif":false,"message":"No camera EXIF metadata present","analyzer":"metadata","createDate":null,"dimensions":{"space":"srgb","width":720,"height":1280,"density":72,"channels":4}},"duplicate":{"sha256":"1f034d20bc1fa3a5534d05624dd70d852bf17fcf41a89a3da6af6cb64bc02ed3","message":"Unique image (SHA-256: 1f034d20bc1f...)","analyzer":"duplicate","isDuplicate":false,"duplicateType":null,"perceptualHash":"00ff007f80ff03e30ff303f433fb000b827f801fc7ff8003c00707ff007f00ff","matchingImageId":null,"minHammingDistance":120},"tampering":{"message":"No explicit tampering signatures identified","analyzer":"tamper","indicators":[],"isTampered":false,"tamperScore":0,"detectedEditor":null},"brightness":{"message":"Lighting is optimal (Mean luminance: 118.04/255)","analyzer":"brightness","darkRatio":0.07,"confidence":0.92,"isLowLight":false,"brightRatio":0.03,"isOverexposed":false,"meanLuminance":118.04,"brightnessState":"normal"},"screenshot":{"message":"Original camera capture verified (No screenshot indicators)","reasons":["Aspect ratio (1.78) matches common mobile/desktop display standard without camera EXIF","PNG format lacking digital camera metadata"],"analyzer":"screenshot","isScreenshot":false,"confidenceScore":40},"licensePlate":{"message":"No valid Indian license plate format identified in OCR text","analyzer":"plate","confidence":0,"primaryPlate":null,"hasValidPlate":false,"detectedPlates":[]}},"status":"completed","vehicle":{"vehicleType":"Auto-Rickshaw","licensePlate":"MH12N W8556","plateDetails":null,"licensePlateValid":false,"makeModelCandidate":"Bajaj RE"},"aiAnalysis":{"enabled":true,"analysis":{"vehicleType":"Auto-Rickshaw","isPhotoOfPhoto":false,"confidenceScore":0.98,"keyObservations":["Vehicle is a three-wheeled auto-rickshaw.","Prominent advertising banner for 'Arena Animation' covers the rear.","License plate is clearly visible and readable, showing 'MH12N W8556'.","'CNG' sticker is visible on the rear left panel, indicating fuel type.","'Pune City' branding is present on the rear panel.","Vehicle body is painted black and yellow, common for auto-rickshaws in India.","Minor wear and dirt consistent with daily use, but no major damage."],"plateLegibility":"Clear","licensePlateText":"MH12N W8556","overallCondition":"Good","makeModelCandidate":"Bajaj RE"},"modelUsed":"gemini-2.5-flash","aiProcessed":true},"durationMs":76534,"processedAt":"2026-08-13T05:01:38.763Z","processingId":"d515d8ff-36b1-48d7-90c3-1caedcb6aad6","overallAssessment":{"flags":[],"qualityScore":100,"recommendation":"ACCEPT","passedVerification":true}}}
```

## 4. Edge Case Tests


### 4.1 Missing image file

```text
POST https://gogig-api.onrender.com/api/v1/images

{"success":false,"error":{"code":"MISSING_FILE","message":"No image file uploaded in field \"image\""}}
```

### 4.2 Invalid file type

```text
POST https://gogig-api.onrender.com/api/v1/images
-F image=@C:\Users\nayan\AppData\Local\Temp\gogig-invalid-test.txt

{"success":false,"error":{"code":"INVALID_FILE_TYPE","message":"Invalid file format: text/plain. Allowed formats: JPEG, PNG, WebP."}}
```

### 4.3 Non-existent processing ID - status

```text
GET https://gogig-api.onrender.com/api/v1/images/00000000-0000-0000-0000-000000000000/status

{"success":false,"error":{"code":"NOT_FOUND","message":"No processing record found for ID: 00000000-0000-0000-0000-000000000000"}}
```

### 4.4 Non-existent processing ID - result

```text
GET https://gogig-api.onrender.com/api/v1/images/00000000-0000-0000-0000-000000000000/result

{"success":false,"error":{"code":"NOT_FOUND","message":"No processing record found for ID: 00000000-0000-0000-0000-000000000000"}}
```

## 5. Test Summary

| Test | Expected behavior |
|---|---|
| Health check | API UP and database/Redis UP |
| 3 sample uploads | Each returns a unique processing ID |
| Async processing | Status progresses through pending/processing to completed or failed |
| Result API | Returns structured image checks and vehicle/AI analysis |
| Missing file | MISSING_FILE error |
| Invalid MIME type | INVALID_FILE_TYPE error |
| Unknown processing ID | NOT_FOUND error |

## 6. Notes

- Production endpoint is intentionally API-first; GET / currently returns ROUTE_NOT_FOUND, which is not a core assignment failure.
- The assignment explicitly lists a dashboard/UI as optional bonus, so a minimal upload-and-results page can be added if time permits.
- Do not manually edit the generated JSON outputs. Re-run this script after deployment changes to regenerate the evidence.

## 7. Production Run Summary


Sample       ProcessingId                         FinalStatus
------       ------------                         -----------
sample_1.png aa08ba51-71fd-4dea-9b49-aad465f13c1d completed  
sample_2.png dbaa7728-8ac0-43f4-8f7d-ce4ad79b86d8 completed  
sample_3.png d515d8ff-36b1-48d7-90c3-1caedcb6aad6 completed  



