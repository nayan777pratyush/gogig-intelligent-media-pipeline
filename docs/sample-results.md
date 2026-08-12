# Sample Vehicle Image Processing Results

This document contains real analysis results produced by running the 3 supplied sample vehicle/auto-rickshaw images through our Intelligent Media Processing Pipeline.

## Sample 1: `sample_1.png`

- **Processing ID**: `sample-001-auto-rickshaw-front`
- **Quality Score**: `85/100`
- **Recommendation**: `REVIEW_REQUIRED`
- **Passed Verification**: `false`
- **Detected Vehicle Type**: `Unknown`
- **License Plate**: `Not Detected`
- **Flags Raised**: `LICENSE_PLATE_NOT_FOUND`

### Complete Analysis JSON Output

```json
{
  "processingId": "sample-001-auto-rickshaw-front",
  "status": "completed",
  "processedAt": "2026-08-12T11:53:34.264Z",
  "durationMs": 19989,
  "image": {
    "originalName": "sample_1.png",
    "mimeType": "image/png",
    "size": 1604658,
    "dimensions": {
      "width": 720,
      "height": 1280,
      "space": "srgb",
      "channels": 4,
      "density": 72
    },
    "hashes": {
      "sha256": "253dd760fc20ff3c53178b8f883a85006eed55d7891bd9827d10b062bd278d1c",
      "perceptualHash": "001f07037fe07ff0fee0ffc0fe00c600dfffc3b9c0007c0079e0fc00df018fc3"
    }
  },
  "vehicle": {
    "licensePlate": null,
    "licensePlateValid": false,
    "plateDetails": null,
    "vehicleType": "Unknown",
    "makeModelCandidate": null
  },
  "checks": {
    "blur": {
      "analyzer": "blur",
      "isBlurry": false,
      "laplacianVariance": 1032,
      "threshold": 40,
      "qualityRating": "sharp",
      "confidence": 0.9,
      "message": "Image sharpness is acceptable (Laplacian variance: 1032)"
    },
    "brightness": {
      "analyzer": "brightness",
      "meanLuminance": 107.9,
      "darkRatio": 0.13,
      "brightRatio": 0.03,
      "brightnessState": "normal",
      "isLowLight": false,
      "isOverexposed": false,
      "confidence": 0.92,
      "message": "Lighting is optimal (Mean luminance: 107.9/255)"
    },
    "duplicate": {
      "analyzer": "duplicate",
      "sha256": "253dd760fc20ff3c53178b8f883a85006eed55d7891bd9827d10b062bd278d1c",
      "perceptualHash": "001f07037fe07ff0fee0ffc0fe00c600dfffc3b9c0007c0079e0fc00df018fc3",
      "isDuplicate": false,
      "duplicateType": null,
      "matchingImageId": null,
      "minHammingDistance": null,
      "message": "Unique image (SHA-256: 253dd760fc20...)"
    },
    "metadata": {
      "analyzer": "metadata",
      "hasExif": false,
      "format": "png",
      "dimensions": {
        "width": 720,
        "height": 1280,
        "space": "srgb",
        "channels": 4,
        "density": 72
      },
      "device": {
        "make": null,
        "model": null,
        "software": null
      },
      "createDate": null,
      "gps": null,
      "message": "No camera EXIF metadata present"
    },
    "ocr": {
      "analyzer": "ocr",
      "rawText": "PC NE\nii rope  /\nwig #\nSERRE\na : /\nol Lg ion\nEY CaF E00 ty oy ]\nRY [A (Wr y\nj a Ce EATIVITY ;\nEr a 2 TUE) i\nSl. LI\nNE\nl h a -———\n& a Sa 4\nLSS a ~ A O A\n\\ C CT =O) fre) ¢ 4 /\nRNC lig Vy\ny % Y 3 = /\nI Ba\nii |\n| Es\nIn| % \\\nI &\n / ; Rs",
      "confidence": 32,
      "wordCount": 82,
      "sampleWords": [
        {
          "text": "PC",
          "confidence": 35.999176025390625
        },
        {
          "text": "NE",
          "confidence": 37.32379913330078
        },
        {
          "text": "ii",
          "confidence": 25.692779541015625
        },
        {
          "text": "rope",
          "confidence": 45.11372375488281
        },
        {
          "text": " /",
          "confidence": 16.312896728515625
        },
        {
          "text": "wig",
          "confidence": 38.570159912109375
        },
        {
          "text": "#",
          "confidence": 35.845855712890625
        },
        {
          "text": "SERRE",
          "confidence": 0
        },
        {
          "text": "a",
          "confidence": 36.167144775390625
        },
        {
          "text": ":",
          "confidence": 21.07098388671875
        }
      ],
      "message": "Extracted 82 words via OCR (Confidence: 32.0%)"
    },
    "licensePlate": {
      "analyzer": "plate",
      "hasValidPlate": false,
      "detectedPlates": [],
      "primaryPlate": null,
      "confidence": 0,
      "message": "No valid Indian license plate format identified in OCR text"
    },
    "screenshot": {
      "analyzer": "screenshot",
      "isScreenshot": false,
      "confidenceScore": 40,
      "reasons": [
        "Aspect ratio (1.78) matches common mobile/desktop display standard without camera EXIF",
        "PNG format lacking digital camera metadata"
      ],
      "message": "Original camera capture verified (No screenshot indicators)"
    },
    "tampering": {
      "analyzer": "tamper",
      "isTampered": false,
      "tamperScore": 0,
      "indicators": [],
      "detectedEditor": null,
      "message": "No explicit tampering signatures identified"
    }
  },
  "aiAnalysis": {
    "enabled": false,
    "aiProcessed": false,
    "reason": "GEMINI_API_KEY environment variable not set"
  },
  "overallAssessment": {
    "passedVerification": false,
    "qualityScore": 85,
    "recommendation": "REVIEW_REQUIRED",
    "flags": [
      "LICENSE_PLATE_NOT_FOUND"
    ]
  }
}
```

---

## Sample 2: `sample_2.png`

- **Processing ID**: `sample-002-auto-rickshaw-side`
- **Quality Score**: `85/100`
- **Recommendation**: `REVIEW_REQUIRED`
- **Passed Verification**: `false`
- **Detected Vehicle Type**: `Unknown`
- **License Plate**: `Not Detected`
- **Flags Raised**: `LICENSE_PLATE_NOT_FOUND`

### Complete Analysis JSON Output

```json
{
  "processingId": "sample-002-auto-rickshaw-side",
  "status": "completed",
  "processedAt": "2026-08-12T11:53:48.725Z",
  "durationMs": 14459,
  "image": {
    "originalName": "sample_2.png",
    "mimeType": "image/png",
    "size": 2330976,
    "dimensions": {
      "width": 960,
      "height": 1280,
      "space": "srgb",
      "channels": 4,
      "density": 72
    },
    "hashes": {
      "sha256": "2b9cd555415dbae56d4653a8dcf7c50170443a4817df67ec99805315ac5eafe9",
      "perceptualHash": "ffd8e1f0203800bf0c07c41e00ffe0ffe0ff207f1077100ff87ffe1ce0041c03"
    }
  },
  "vehicle": {
    "licensePlate": null,
    "licensePlateValid": false,
    "plateDetails": null,
    "vehicleType": "Unknown",
    "makeModelCandidate": null
  },
  "checks": {
    "blur": {
      "analyzer": "blur",
      "isBlurry": false,
      "laplacianVariance": 2572.49,
      "threshold": 40,
      "qualityRating": "sharp",
      "confidence": 0.9,
      "message": "Image sharpness is acceptable (Laplacian variance: 2572.49)"
    },
    "brightness": {
      "analyzer": "brightness",
      "meanLuminance": 124.64,
      "darkRatio": 0.04,
      "brightRatio": 0.07,
      "brightnessState": "normal",
      "isLowLight": false,
      "isOverexposed": false,
      "confidence": 0.92,
      "message": "Lighting is optimal (Mean luminance: 124.64/255)"
    },
    "duplicate": {
      "analyzer": "duplicate",
      "sha256": "2b9cd555415dbae56d4653a8dcf7c50170443a4817df67ec99805315ac5eafe9",
      "perceptualHash": "ffd8e1f0203800bf0c07c41e00ffe0ffe0ff207f1077100ff87ffe1ce0041c03",
      "isDuplicate": false,
      "duplicateType": null,
      "matchingImageId": null,
      "minHammingDistance": null,
      "message": "Unique image (SHA-256: 2b9cd555415d...)"
    },
    "metadata": {
      "analyzer": "metadata",
      "hasExif": false,
      "format": "png",
      "dimensions": {
        "width": 960,
        "height": 1280,
        "space": "srgb",
        "channels": 4,
        "density": 72
      },
      "device": {
        "make": null,
        "model": null,
        "software": null
      },
      "createDate": null,
      "gps": null,
      "message": "No camera EXIF metadata present"
    },
    "ocr": {
      "analyzer": "ocr",
      "rawText": "- =F i ass] =\nie | f I = i\n: — [P= VPSVSOENTADCINC © 8 [a oe g\nMee DOPAMINE [5 El Lally dai € b [9425 {\nk REN Po hd Jill :\n— . as 4 = oa on 88, EH , UB Rl\nx iy hear i ENING\nNT I © 0500020008 ) Be\n| \\ AT i b\n= Zi A ” | ¥\n— >\nIE: [4/8\nST AP :\nJ 5 » — DrAg se da i\n3 — pans >\n\\ : pe855! - 11160 v 2\na PLL)\nae » [luass=—\"\" _ = #\n| \\_8 Z il\nAS 2  _ ,\nol NRRL INNS bi “= § :\na SY = = CA\ny oy UA 3 a) =,\n- ay\nPP A | © = =\n> 4 \\ | ~\nrv is A x )- g ch Soe\n”- ; aw 5 . : © o Re\nE Tuesday, 17 Feb 2026 11:22 AM\n= Perambur High Road, CMWSSB Division 70, Perambur, Ward 70, Zone 6 Thiru. Vi.\nEi wily Ka. Nagar, Chennai Corporation, Chennai, Tamil Nadu, 600011, India\ny Lat: 13.1059115 | Long: 80.2514811\nTASK ID: 22FUGV4G2K glcig|",
      "confidence": 42,
      "wordCount": 202,
      "sampleWords": [
        {
          "text": "-",
          "confidence": 53.188480377197266
        },
        {
          "text": "=F",
          "confidence": 30.04706573486328
        },
        {
          "text": "i",
          "confidence": 14.6134033203125
        },
        {
          "text": "ass]",
          "confidence": 0
        },
        {
          "text": "=",
          "confidence": 49.589996337890625
        },
        {
          "text": "ie",
          "confidence": 25.41327667236328
        },
        {
          "text": "|",
          "confidence": 36.03546905517578
        },
        {
          "text": "f",
          "confidence": 0
        },
        {
          "text": "I",
          "confidence": 25.347747802734375
        },
        {
          "text": "=",
          "confidence": 62.718624114990234
        }
      ],
      "message": "Extracted 202 words via OCR (Confidence: 42.0%)"
    },
    "licensePlate": {
      "analyzer": "plate",
      "hasValidPlate": false,
      "detectedPlates": [],
      "primaryPlate": null,
      "confidence": 0,
      "message": "No valid Indian license plate format identified in OCR text"
    },
    "screenshot": {
      "analyzer": "screenshot",
      "isScreenshot": false,
      "confidenceScore": 40,
      "reasons": [
        "Aspect ratio (1.33) matches common mobile/desktop display standard without camera EXIF",
        "PNG format lacking digital camera metadata"
      ],
      "message": "Original camera capture verified (No screenshot indicators)"
    },
    "tampering": {
      "analyzer": "tamper",
      "isTampered": false,
      "tamperScore": 0,
      "indicators": [],
      "detectedEditor": null,
      "message": "No explicit tampering signatures identified"
    }
  },
  "aiAnalysis": {
    "enabled": false,
    "aiProcessed": false,
    "reason": "GEMINI_API_KEY environment variable not set"
  },
  "overallAssessment": {
    "passedVerification": false,
    "qualityScore": 85,
    "recommendation": "REVIEW_REQUIRED",
    "flags": [
      "LICENSE_PLATE_NOT_FOUND"
    ]
  }
}
```

---

## Sample 3: `sample_3.png`

- **Processing ID**: `sample-003-auto-rickshaw-rear`
- **Quality Score**: `85/100`
- **Recommendation**: `REVIEW_REQUIRED`
- **Passed Verification**: `false`
- **Detected Vehicle Type**: `Unknown`
- **License Plate**: `Not Detected`
- **Flags Raised**: `LICENSE_PLATE_NOT_FOUND`

### Complete Analysis JSON Output

```json
{
  "processingId": "sample-003-auto-rickshaw-rear",
  "status": "completed",
  "processedAt": "2026-08-12T11:54:08.862Z",
  "durationMs": 20135,
  "image": {
    "originalName": "sample_3.png",
    "mimeType": "image/png",
    "size": 1820361,
    "dimensions": {
      "width": 720,
      "height": 1280,
      "space": "srgb",
      "channels": 4,
      "density": 72
    },
    "hashes": {
      "sha256": "1f034d20bc1fa3a5534d05624dd70d852bf17fcf41a89a3da6af6cb64bc02ed3",
      "perceptualHash": "00ff007f80ff03e30ff303f433fb000b827f801fc7ff8003c00707ff007f00ff"
    }
  },
  "vehicle": {
    "licensePlate": null,
    "licensePlateValid": false,
    "plateDetails": null,
    "vehicleType": "Unknown",
    "makeModelCandidate": null
  },
  "checks": {
    "blur": {
      "analyzer": "blur",
      "isBlurry": false,
      "laplacianVariance": 2389.49,
      "threshold": 40,
      "qualityRating": "sharp",
      "confidence": 0.9,
      "message": "Image sharpness is acceptable (Laplacian variance: 2389.49)"
    },
    "brightness": {
      "analyzer": "brightness",
      "meanLuminance": 118.04,
      "darkRatio": 0.07,
      "brightRatio": 0.03,
      "brightnessState": "normal",
      "isLowLight": false,
      "isOverexposed": false,
      "confidence": 0.92,
      "message": "Lighting is optimal (Mean luminance: 118.04/255)"
    },
    "duplicate": {
      "analyzer": "duplicate",
      "sha256": "1f034d20bc1fa3a5534d05624dd70d852bf17fcf41a89a3da6af6cb64bc02ed3",
      "perceptualHash": "00ff007f80ff03e30ff303f433fb000b827f801fc7ff8003c00707ff007f00ff",
      "isDuplicate": false,
      "duplicateType": null,
      "matchingImageId": null,
      "minHammingDistance": null,
      "message": "Unique image (SHA-256: 1f034d20bc1f...)"
    },
    "metadata": {
      "analyzer": "metadata",
      "hasExif": false,
      "format": "png",
      "dimensions": {
        "width": 720,
        "height": 1280,
        "space": "srgb",
        "channels": 4,
        "density": 72
      },
      "device": {
        "make": null,
        "model": null,
        "software": null
      },
      "createDate": null,
      "gps": null,
      "message": "No camera EXIF metadata present"
    },
    "ocr": {
      "analyzer": "ocr",
      "rawText": "ARR = FW SOE\n\niE EREUN NG E £\n\naR IN, TRA 2S ;\nWY Bhat No TN EH NS 3 ¢\nx Ww y HN WN Prin ~y I y (I 8\nso oN dt on\n\nFe Tea\nCSS SEO a B\n\\ - a ma? |\n) \\y (Ihde\nar ), SE\nCV meNEsFcROAD :\nLs [DESO] 7755900813 |=\nCAN) aaa . 3 as\nFIRE PRY: ARENA iy\nHE a SEE\nsa) =r) =\n= WM od A) sftoerafe,\n\n: AS Veg |\n\nvo dy Cael cpenmyiry\n> ES © vy 5 9\nFn |g TN NES wit\nI 5 Lai GLOBAL ALUMNI 1 Eee ar |\na a memos corer ff J)\nJ+ RECRUITERS ——— -\n\n. gl]\noi | - Se— =\nio = Se—— ( f\n: : 3 ‘©. 0\nv (Bi (rs\n\nmmm aww ann] |\niE Fro ig LSS Ie | 2N'}\n\na © — in\ng » 7 ’ i i\nje: 2 §\n\n\\ SA fo\ni Cs SE\nah 2 LAT Re ha CORTE ae i ON ER\nSen IEE a Ri SNARES\nfa. add A At CONN\n\n\" 0 Es EAR b WE on Sa\nPons CT TER CUSERNER\na pss / Bl adie os Be\nBT fr Bal is a aly PREIS\n\ngn ¥ bie is Hh fio <n EAH\n\nCi: a ER Cl CS IRE\nPAE SARE eg fA\nheels DR REE cd\n6. TT Kila YUH AE deems HR, Ae\nPp CEES Een ee Re Ree\na SE A rR RN\nJ ERE 2 LT",
      "confidence": 25,
      "wordCount": 260,
      "sampleWords": [
        {
          "text": "ARR",
          "confidence": 8.474662780761719
        },
        {
          "text": "=",
          "confidence": 0
        },
        {
          "text": "FW",
          "confidence": 13.126708984375
        },
        {
          "text": "SOE",
          "confidence": 40.842472076416016
        },
        {
          "text": "iE",
          "confidence": 14.052040100097656
        },
        {
          "text": "EREUN",
          "confidence": 0
        },
        {
          "text": "NG",
          "confidence": 25.757064819335938
        },
        {
          "text": "E",
          "confidence": 0
        },
        {
          "text": "£",
          "confidence": 32.856475830078125
        },
        {
          "text": "aR",
          "confidence": 24.83654022216797
        }
      ],
      "message": "Extracted 260 words via OCR (Confidence: 25.0%)"
    },
    "licensePlate": {
      "analyzer": "plate",
      "hasValidPlate": false,
      "detectedPlates": [],
      "primaryPlate": null,
      "confidence": 0,
      "message": "No valid Indian license plate format identified in OCR text"
    },
    "screenshot": {
      "analyzer": "screenshot",
      "isScreenshot": false,
      "confidenceScore": 40,
      "reasons": [
        "Aspect ratio (1.78) matches common mobile/desktop display standard without camera EXIF",
        "PNG format lacking digital camera metadata"
      ],
      "message": "Original camera capture verified (No screenshot indicators)"
    },
    "tampering": {
      "analyzer": "tamper",
      "isTampered": false,
      "tamperScore": 0,
      "indicators": [],
      "detectedEditor": null,
      "message": "No explicit tampering signatures identified"
    }
  },
  "aiAnalysis": {
    "enabled": false,
    "aiProcessed": false,
    "reason": "GEMINI_API_KEY environment variable not set"
  },
  "overallAssessment": {
    "passedVerification": false,
    "qualityScore": 85,
    "recommendation": "REVIEW_REQUIRED",
    "flags": [
      "LICENSE_PLATE_NOT_FOUND"
    ]
  }
}
```

---

