<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range');
header('Access-Control-Expose-Headers: Content-Length,Content-Range');

// check if image is uploaded via POST method
if(isset($_FILES['screenshot'])){
    
    // file details
    $file_name = $_FILES['screenshot']['name'];
    $file_size = $_FILES['screenshot']['size'];
    $file_tmp = $_FILES['screenshot']['tmp_name'];
    $file_type = $_FILES['screenshot']['type'];
    $file_ext = strtolower(end(explode('.',$_FILES['screenshot']['name'])));
    
    // allowed file extensions
    $extensions = array("jpeg","jpg","png");
    
    // check if file extension is allowed
    if(in_array($file_ext,$extensions) === false){
        $response = array(
            'status' => 'error',
            'message' => 'File extension not allowed, please choose a JPEG or PNG file.'
        );
    }
    
    // check if file size is less than 5MB
    elseif($file_size > 5242880){
        $response = array(
            'status' => 'error',
            'message' => 'File size exceeds 5MB limit.'
        );
    }
    
    // if file is valid, move it to server
    else{
        $upload_dir = 'uploads/';
        $upload_file = $upload_dir . basename($file_name);
        
        if(move_uploaded_file($file_tmp,$upload_file)){
            $response = array(
                'status' => 'success',
                'message' => 'File uploaded successfully.'
            );
        }
        else{
            $response = array(
                'status' => 'error',
                'message' => 'File upload failed. Please try again later.'
            );
        }
    }
    
    // send response in JSON format
    header('Content-Type: application/json');
    echo json_encode($response);
}
else{
    $response = array(
        'status' => 'error',
        'message' => 'Image not uploaded.'
    );
    
    // send response in JSON format
    header('Content-Type: application/json');
    echo json_encode($response);
}

?>
