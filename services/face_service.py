import os
from deepface import DeepFace
from utils.log_utils import log_message

def image_loader(directory_path):
    image_files = [f for f in os.listdir(directory_path) if f.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp'))]
    images = []
    for image_file in image_files:
        image_path = os.path.join(directory_path, image_file)
        # img = cv2.imread(image_path)
        # if img is not None:
            # images.append((image_path, img))
        images.append(image_path)

    return images

def detect_faces(saved_faces_directory,log_file_name):
    backends = ['opencv', 'ssd', 'dlib', 'mtcnn', 'retinaface', 'mediapipe']
    images= image_loader(saved_faces_directory)
    # print(file_path)
    p1= r'C:\Users\SinghJot\OneDrive\Documents\Others\Projects\Semester_Project\Attendence System V3\project\uploads\image.jpg'
    log_message(p1,log_file_name)
    for image_path in images:
        # print(image_path)
        result = DeepFace.verify(img1_path=p1, img2_path=image_path, detector_backend=backends[1])
        log_message(image_path,log_file_name)
        log_message(result,log_file_name)
        if result['verified'] is True: 
            roll_no = os.path.splitext(os.path.basename(image_path))[0]
            # print(result)
            return roll_no
    return None

