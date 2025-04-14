`use client`;

import React from "react";
import { Button } from "antd";
import styles from "./VipActionButtons.module.scss";

export default function VipActionButtons() {
  return (
    <div style={{ padding: 10 }}>
      <div className={styles.tableActions}>
        <Button type="primary" className={styles.addButton}>
          + 新增会员信息
        </Button>
        <Button className={styles.exportButton}>导出会员报告</Button>
        <div className={styles.rightActions}>
          <Button className={styles.quickButton}>快捷操作</Button>
          <Button className={styles.printButton}>打印</Button>
        </div>
      </div>
    </div>
  );
}
