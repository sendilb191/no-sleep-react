import React from 'react';

const HiddenVideo = ({ videoRef }) => {
  return (
    <video ref={videoRef} muted loop playsInline style={{ display: 'none' }}>
      <source
        src='data:video/mp4;base64,AAAAHGZ0eXBpc29tAAACAGlzb21pc28ybXA0MQAAAAhmcmVlAAAACG1kYXQAAAAPbW9vdgAAAGxtdmhkAAAAANUxdb7VMXW+AAAAUAAAAUAAQUAAACAAAAEAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAACFpb2RzAAAAE2VzZHMAAAAAA4CAgE8AAQAAAAAAAAABAAAAAAAAAA=='
        type='video/mp4'
      />
    </video>
  );
};

export default HiddenVideo;
