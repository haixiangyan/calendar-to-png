import React, {useEffect, useState} from 'react'
import {toJpeg} from 'html-to-image';
import './App.css';
import dayjs from 'dayjs';

const download = (uri: string, name: string) => {
  const link = document.createElement("a");
  link.download = name;
  link.href = uri;
  link.click();

  setTimeout(() => {
    link.remove();
  }, 200);
}

function App() {
  const [imageUrl, setImageUrl] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  // 日期选中监听
  const onSelected = (e: any) => {
    const curtName = dayjs(e.detail.selected).format('YYYY-MM-DD');

    console.log('selected', curtName);

    setSelectedDate(curtName)
    onConvert();
  }

  useEffect(() => {
    const node = document.getElementById('wired-calendar');

    if (node) {
      node.addEventListener('selected', onSelected);
    }

    return () => {
      if (node) {
        node.removeEventListener('selected', onSelected);
      }
    }
  }, []);

  const onConvert = () => {
    const node = document.getElementById('wired-calendar');

    if (!node) {
      return alert("找不到节点")
    }

    toJpeg(node)
      .then(function (dataUrl: string) {
        setImageUrl(dataUrl);

        // 因为要等 image 渲染出来，所以需要加一个 setTimeout 操作
        setTimeout(() => {
          const image = document.getElementById('result');

          if (!image) {
            return alert('找不到图片')
          }
          (image as HTMLImageElement).src = dataUrl;
        }, 300);
      })
      .catch(function (error: Error) {
        console.error('转换出错：', error);
      });
  };

  // 下载生成结果
  const onDownload = () => {
    download(imageUrl, selectedDate);
  }

  return (
    <div className="root">
      {/*容器*/}
      <div>
        <wired-calendar id="wired-calendar" onSelected={onSelected}/>
      </div>

      {imageUrl && (
        <div>
          <hr/>

          {/*结果*/}
          <div>
            <h1>生成结果</h1>
            <img style={{width: 320}} id="result"/>
          </div>

          {/*下载图片*/}
          <div>
            <button onClick={onDownload}>下载结果</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
