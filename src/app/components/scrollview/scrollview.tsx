'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Avatar, List, message } from 'antd';
import VirtualList from 'rc-virtual-list';

interface ScrollViewProps {
  style?: React.CSSProperties;
  className?: string;
}

interface UserItem {
  email: string;
  gender: string;
  name: {
    first: string;
    last: string;
    title: string;
  };
  nat: string;
  picture: {
    large: string;
    medium: string;
    thumbnail: string;
  };
}

const fakeDataUrl =
  'https://randomuser.me/api/?results=20&inc=name,gender,email,nat,picture&noinfo';

export default function ScrollView({ style, className = "tang_scrollview" }: ScrollViewProps) {
  const [data, setData] = useState<UserItem[]>([]);
  const [height, setHeight] = useState(0); // 用于存储父容器的高度
  const listRef = useRef<HTMLDivElement>(null); // 用于获取父容器的引用

  const appendData = (showMessage = true) => {
    fetch(fakeDataUrl)
      .then((res) => res.json())
      .then((body) => {
        setData(data.concat(body.results));
        showMessage && message.success(`${body.results.length} more items loaded!`);
      });
  };

  useEffect(() => {
    appendData(false);
  }, []);

  useEffect(() => {
    // 动态获取父容器的高度
    if (listRef.current) {
      setHeight(listRef.current.clientHeight);
    }

    // 监听窗口大小变化，动态调整高度
    const handleResize = () => {
      if (listRef.current) {
        setHeight(listRef.current.clientHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    // 清理事件监听器
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const onScroll = (e: React.UIEvent<HTMLElement, UIEvent>) => {
    if (
      Math.abs(
        Number(e.currentTarget.scrollHeight) -
        Number(e.currentTarget.scrollTop) -
        Number(e.currentTarget.clientHeight)
      ) <= 1
    ) {
      appendData();
    }
  };

  return (
    <div ref={listRef} className={className} style={{ ...style, height: '100%' }}>
      <List style={{ height: '100%' }}>
        <VirtualList
          data={data}
          height={height} // 使用动态计算的高度
          itemHeight={47}
          itemKey="email"
          onScroll={onScroll}
        >
          {(item: UserItem) => (
            <List.Item key={item.email}>
              <List.Item.Meta
                avatar={<Avatar src={item.picture.large} />}
                title={<a href="https://ant.design">{item.name.last}</a>}
                description={item.email}
              />
              <div>Content</div>
            </List.Item>
          )}
        </VirtualList>
      </List>
    </div>
  );
}