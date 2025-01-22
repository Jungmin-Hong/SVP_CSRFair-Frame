import React, { useState, useRef, useEffect } from 'react';
import Button from './Button';
import Button2 from './Button2';

const App = () => {
  const [imageSrc, setImageSrc] = useState(null); // 업로드된 이미지 경로
  const [selectedFrame, setSelectedFrame] = useState('/frame1.png'); // 선택된 프레임 이미지 경로
  const canvasRef = useRef(null);

  const canvasWidth = 1080; // 캔버스 가로 크기
  const canvasHeight = 1920; // 캔버스 세로 크기

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => setImageSrc(e.target.result); // 이미지 데이터 저장
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  useEffect(() => {
    if (imageSrc) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      // 업로드된 이미지 렌더링
      const uploadedImage = new Image();
      uploadedImage.src = imageSrc;
      uploadedImage.onload = () => {
        // 캔버스 비율에 맞게 업로드된 이미지 크기 조정
        const scaleX = canvas.width / uploadedImage.width;
        const scaleY = canvas.height / uploadedImage.height;
        const scale = Math.max(scaleX, scaleY);

        const x = (canvas.width / 2) - (uploadedImage.width / 2) * scale;
        const y = (canvas.height / 2) - (uploadedImage.height / 2) * scale;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(uploadedImage, x, y, uploadedImage.width * scale, uploadedImage.height * scale);

        // 선택된 프레임 이미지 렌더링 (이미지 위에 얹기)
        const frame = new Image();
        frame.src = selectedFrame;
        frame.onload = () => {
          // 프레임을 이미지 위에 그리기
          ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);
        };
      };
    }
  }, [imageSrc, selectedFrame]); // selectedFrame이 변경되면 프레임을 다시 그리도록 변경

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const imageData = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'framed-image.png';
    link.href = imageData;
    link.click();
  };

  // 프레임 선택 함수
  const handleFrameChange = (frame) => {
    setSelectedFrame(frame);
  };

  return (
    <div className="p-4" style={{ paddingLeft: '15px' }}>
      <h1 className="text-lg font-bold mb-4">내 비버와 사진 찍기~!</h1>

      {/* 이미지 업로드 */}
      <input
        type="file"
        onChange={handleImageChange}
        accept="image/*"
        className="block w-full text-sm text-gray-500
                   file:mr-4 file:py-2 file:px-4
                   file:border-0 file:text-sm file:font-semibold
                   file:bg-blue-50 file:text-blue-700
                   hover:file:bg-blue-100"
      />

      {/* 프레임 선택 버튼들 */}
      <div className="mt-4">
        <h2 className="text-lg font-semibold">프레임 선택</h2>
        <div className="button-container">
          {['요리왕조리왕', '네일아티스트', '디자이너', '지게차드라이버', '반려견미용사', '반도체마스터', '네트워크전문', '중공업전문가', '전기설비기사'].map((frameName, index) => (
            <div className="buttons" key={index}>
              <Button
                onClick={() => handleFrameChange(`/frame${index + 1}.png`)}
                className="p-2 bg-gray-300 rounded hover:bg-gray-500"
              >
                {frameName}
              </Button>
            </div>
          ))}
        </div>
      </div>

      <Button2>
      <div
        onClick={downloadImage}
        disabled={!imageSrc}
        className={`mt-4 px-4 py-2 bg-blue-500 text-white font-bold text-lg rounded
                    hover:bg-blue-700 focus:outline-none focus:ring-2
                    focus:ring-blue-500 focus:ring-opacity-50
                    ${!imageSrc ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        Download Image
      </div>
      </Button2>

      {/* 캔버스 미리보기 */}
      <div className="mt-4">
        {imageSrc ? (
          <canvas
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
            style={{ border: '1px solid #ccc', maxWidth: '50%' }}
          />
        ) : (
          <p className="text-gray-500">이미지를 업로드하면 미리보기가 여기에 표시됩니다.</p>
        )}
      </div>
    </div>
  );
};

export default App;
