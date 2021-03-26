import cv2
from datetime import datetime

last_detected = datetime.now()
while True:
    ret, frame = cv2.VideoCapture('b063c451-664f-4b8a-b2c2-8e12985eaf69.mp4').read()
    if not ret:
        break

    # detect gesture here
    gesture = detect_gesture()

    if gesture:
        last_detected = datetime.now()
    else:
        if (datetime.now() - last_detected).total_seconds() < 2:
            cv2.putText(frame, 'detected:', (50, 50), self.font, 0.8, (0, 0, 0), 2)

    cv2.imshow("frame", frame)
    cv2.waitKey(1)
