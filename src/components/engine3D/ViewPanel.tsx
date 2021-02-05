/**
 * @description: 查看面板
 * @author: cnn
 * @createTime: 2021/2/5 9:57
 **/
import React, { useState } from 'react';
import './ViewPanel.less';

export const useViewPanel = () => {
  const [panelTop, setPanelTop] = useState<number>(0);
  const [panelLeft, setPanelLeft] = useState<number>(0);
  const [display, setDisplay] = useState<string>('none');
  const [viewChildren, setViewChildren] = useState<React.ReactNode>();
  // 显示面板
  const setViewPanel = (top: number, left: number, viewChildren: React.ReactNode) => {
    setPanelTop(top);
    setPanelLeft(left);
    setDisplay('flex');
    setViewChildren(viewChildren);
  };
  // 隐藏面板
  const hiddenViewPanel = () => {
    setDisplay('none');
  };
  return { panelTop, panelLeft, display, viewChildren, setViewPanel, hiddenViewPanel };
};

interface IProps {
  top: number,
  left: number,
  display?: string,
  viewChildren: React.ReactNode
}

const ViewPanel = (props: IProps) => {
  const { top, left, viewChildren, display = 'none' } = props;
  return (
    <div className="panel" style={{ top, left, display }}>
      {viewChildren}
    </div>
  );
};
export default ViewPanel;
