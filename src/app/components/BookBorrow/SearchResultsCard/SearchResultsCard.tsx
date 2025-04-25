"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { App } from "antd";
import { Card, Typography, Button, Space } from "antd";
import TangTable from "@/components/TangTable/TangTable";
import type { ColumnsType } from "antd/es/table";
import type { BookItem } from "@/api/books/borrow/borrow";
import "./SearchResultsCard.scss";
import ChooseCopyIDModal from "./ChooseCopyIDModal/ChooseCopyIDModal";

const { Title } = Typography;

interface SearchResultsCardProps {
  searchResults: BookItem[];
  searchCurrentPage: number;
  searchTotal: number;
  searchPageSize: number;
  searchLoading: boolean;
  // selectedRowKeys: React.Key[];
  onPageChange: (page: number, size?: number) => void;
  // onCancel: () => void;
}

const SearchResultsCard: React.FC<SearchResultsCardProps> = ({
  searchResults,
  searchCurrentPage,
  searchTotal,
  searchPageSize,
  searchLoading,
  onPageChange,
}) => {
  const { message } = App.useApp();

  // 选择副本模态框状态
  const [chooseModalVisible, setChooseModalVisible] = useState<boolean>(false);
  const [currentRecord, setCurrentRecord] = useState<BookItem | undefined>(
    undefined
  );

  // 类别中英映射
  const categoryEToCMap: Record<BookItem["category"], string> = {
    children_story: "儿童故事",
    science_knowledge: "科普知识",
    art_enlightenment: "艺术启蒙",
  };

  // 搜索结果表格列配置
  const searchResultColumns: ColumnsType<BookItem> = [
    { title: "序号", dataIndex: "index", align: "center", width: 60 },
    { title: "图书编号", dataIndex: "book_id", align: "center", width: 100 },
    { title: "书名", dataIndex: "name", align: "center", width: 100 },
    {
      title: "类别",
      dataIndex: "category",
      align: "center",
      width: 100,
      render: (category: BookItem["category"]) => (
        <span>{categoryEToCMap[category]}</span>
      ),
    },
    { title: "出版社", dataIndex: "publisher", align: "center", width: 100 },
    { title: "作者", dataIndex: "author", align: "center", width: 80 },
    {
      title: "操作",
      align: "center",
      width: 80,
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleChoose(record)}>
            选择
          </Button>
        </Space>
      ),
    },
  ];

  // 处理编辑按钮点击
  const handleChoose = (record: BookItem) => {
    setCurrentRecord(record);
    setChooseModalVisible(true);
  };

  // // 表格行选择配置
  // const rowSelection = {
  //   selectedRowKeys,
  //   onChange: onSelectChange,
  // }

  return (
    <Card className="search-results-card" variant="outlined">
      <div className="results-header">
        <Title level={5} style={{ color: "#F59A23", marginBottom: '8px' }}>
          结果：
        </Title>
      </div>
      <div className="table-responsive">
        <TangTable
          columns={searchResultColumns}
          dataSource={searchResults}
          currentPage={searchCurrentPage}
          total={searchTotal}
          pageSize={searchPageSize}
          onPageChange={onPageChange}
          scroll={{ x: "max-content", y: 49 * 10 }}
          tableProps={{
            loading: searchLoading,
            // rowSelection: rowSelection,
            bordered: true,
          }}
        />
      </div>
      {/* 模态框 */}
      <ChooseCopyIDModal
        visible={chooseModalVisible}
        onCancel={() => setChooseModalVisible(false)}
        onSuccess={
          () => {
            message.success("借阅成功");
            setChooseModalVisible(false);
          }
        }
        record={currentRecord}
      />
    </Card>
  );
};

export default SearchResultsCard;
