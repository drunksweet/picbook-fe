"use client";

import { title } from "process";
// import "./index.sass";
import React from "react";

interface BannerProps {
  title: string;
  style?: React.CSSProperties;
}

export default function Banner({ title, style }: BannerProps) {
  const defaultStyle : React.CSSProperties = { 
    height: '4vh',
    background: "white",
    display: 'flex',
    alignItems: 'center'
  };

  const combinedStyle: React.CSSProperties ={
    ...defaultStyle,
    ...style,
  } 
  return (
    <div className="banner-container" style={combinedStyle}>
      <h2 style={{paddingLeft: '3rem', fontSize: '1.2rem' , fontWeight: '550', color: '#B8741A'}}>{title}</h2>
    </div>
  );
}
