import React from "react";
import { ScaleLoader } from "react-spinners";

export default function Loader() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 'var(--space-8)',
      minHeight: '200px'
    }}>
      <ScaleLoader 
        color="var(--primary-600)" 
        height={35}
        width={4}
        radius={2}
        margin={2}
      />
    </div>
  );
}