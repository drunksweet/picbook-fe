import axios from "src/api/axios";
import { message } from "antd";

// 可借用副本的接口
export interface CopyIdItem {
  key: string;
  index: number;
  copy_id: number;
}

// 获取可借用副本的参数
export interface GetAvailableCopiesParams {
  book_id: string | number;
  page: number;
  page_size: number;
}

// 获取可借用副本的响应
export interface CopyIdResponse {
  code: number;
  data: {
    copy_ids: number[];
  };
  msg: string;
}

// 借阅请求参数
export interface BorrowRequestParams {
  book_id: string | number;
  borrower_id: string | number;
  copy_id: number;
  expected_return_time: string;
}

// 借阅响应
export interface BorrowResponse {
  code: number;
  data: {
    book_id: number;
    copy_id: number;
  };
  msg: string;
}

export interface BorrowRecordItem {
  key: string;
  index: number;
  //
  book_id?: string;
  copy_id: string;
  return_status: "waiting_return" | "returned" | "overdue";
  should_return_time: string;
  user_id?: string;
  user_name: string;
}

export interface SearchBorrowRecordsParams {
  page: number;
  page_size: number;
  query_status?: string;
  user_name?: string;
  book_id?: string;
  copy_id?: string;
}

export interface ApiResponse {
  code: number;
  data: {
    borrow_records: BorrowRecordItem[];
    current_page: number;
    total_num: number;
    total_page: number;
  };
  msg: string;
}

export interface SearchBookParams {
  book_id?: string;
  name?: string;
  category?: string;
  author?: string;
  page: number;
  page_size: number;
}

export interface BookItem {
  key: string;
  index: number;
  copy_id: string;
  book_id: string;
  name: string;
  category: "children_story" | "science_knowledge" | "art_enlightenment";
  publisher: string;
  author: string;
}

export interface BookApiResponse {
  code: number;
  data: {
    books: BookItem[];
    current_page: number;
    total_num: number;
    total_page: number;
  };
  msg: string;
}
/**
 * 获取可借用的副本ID列表
 * @param params 查询参数
 * @returns 处理后的响应数据
 */
export const getAvailableCopies = async (params: GetAvailableCopiesParams) => {
  try {
    // 从localStorage获取认证token
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      return {
        success: false,
        error: "认证失败",
        needLogin: true,
      };
    }

    const res = await axios.get<CopyIdResponse>("/v1/book/available_copies", {
      params,
      headers: {
        Authorization: authToken,
      },
    });

    if (res.data.code === 200 || res.data.code === 0) {
      // 处理数据，添加key和index
      const processedData = res.data.data.copy_ids.map((copyId, index) => ({
        key: index.toString(),
        index: (params.page - 1) * params.page_size + index + 1,
        copy_id: copyId,
      }));

      // 判断是否有下一页
      const hasNextPage =
        res.data.data.copy_ids.length === params.page_size + 1;

      // 如果有下一页，移除最后一条数据（这是下一页的指示器）
      const items = hasNextPage
        ? processedData.slice(0, params.page_size)
        : processedData;

      return {
        success: true,
        data: {
          items,
          hasNextPage,
        },
      };
    } else {
      return {
        success: false,
        error: res.data.msg || "获取可借用副本失败",
      };
    }
  } catch (error) {
    console.error("获取可借用副本失败:", error);
    return {
      success: false,
      error: "获取可借用副本失败，请稍后重试",
    };
  }
};

/**
 * 借阅图书
 * @param params 借阅参数
 * @returns 处理后的响应数据
 */
export const borrowBookWithCopyId = async (params: BorrowRequestParams) => {
  try {
    const res = await axios.post<BorrowResponse>("/v1/book/borrow/add", params, {
    });

    if (res.data.code === 200 || res.data.code === 0) {
      return {
        success: true,
        data: res.data.data,
        message: "借阅成功",
      };
    } else {
      return {
        success: false,
        error: res.data.msg || "借阅失败",
      };
    }
  } catch (error) {
    console.error("借阅图书失败:", error);
    return {
      success: false,
      error: "借阅图书失败，请稍后重试",
    };
  }
};

/**
 * 获取借阅记录数据
 * @param params 查询参数，必须包含page和page_size
 * @returns 处理后的响应数据
 */
export const fetchBorrowRecords = async (params: SearchBorrowRecordsParams) => {
  // 验证必填参数
  if (params.page === undefined || params.page_size === undefined) {
    console.error("fetchBorrowRecords: page和page_size是必填参数");
    return {
      success: false,
      error: "请求参数错误：缺少分页信息",
    };
  }

  try {
    // 确保请求参数中包含page和page_size
    const requestParams = {
      ...params,
      page: params.page,
      page_size: params.page_size,
    };

    const res = await axios.get<ApiResponse>("/v1/book/borrow/query", {
      params: requestParams,
    });

    if (res.data.code === 200 || res.data.code === 0) {
      const { borrow_records, current_page, total_page, total_num } =
        res.data.data;

      // 处理数据，添加key和index
      const processedData = borrow_records.map((item, index) => ({
        ...item,
        key: index.toString(),
        index: (current_page - 1) * params.page_size + index + 1,
      }));

      return {
        success: true,
        data: {
          items: processedData,
          currentPage: current_page,
          totalPages: total_page,
          total: total_num,
        },
      };
    } else {
      return {
        success: false,
        error: res.data.msg || "获取数据失败",
      };
    }
  } catch (error) {
    console.error("获取借阅记录失败:", error);
    return {
      success: false,
      error: "获取借阅记录失败，请稍后重试",
    };
  }
};

/**
 * 搜索图书 复用库存查询接口
 * @param params 查询参数，必须包含page和page_size
 * @returns 处理后的响应数据
 */
export const searchBooks = async (params: SearchBookParams) => {
  // 验证必填参数
  if (params.page === undefined || params.page_size === undefined) {
    console.error("searchBooks: page和page_size是必填参数");
    return {
      success: false,
      error: "请求参数错误：缺少分页信息",
    };
  }

  try {
    // 确保请求参数中包含page和page_size
    const requestParams = {
      ...params,
      page: params.page,
      page_size: params.page_size,
    };

    const res = await axios.get<BookApiResponse>("/v1/book/stock/fuzzy_query", {
      params: requestParams,
    });

    if (res.data.code === 200) {
      const { books, current_page, total_page, total_num } = res.data.data;

      // 处理数据，添加key和index
      const processedData = books.map((item, index) => ({
        ...item,
        key: index.toString(),
        index: (current_page - 1) * params.page_size + index + 1,
      }));

      return {
        success: true,
        data: {
          items: processedData,
          currentPage: current_page,
          totalPages: total_page,
          total: total_num,
        },
      };
    } else {
      return {
        success: false,
        error: res.data.msg || "搜索图书失败",
      };
    }
  } catch (error) {
    console.error("搜索图书失败:", error);
    return {
      success: false,
      error: "搜索图书失败，请稍后重试",
    };
  }
};

// /**
//  * 借阅图书
//  * @param copyId 副本ID
//  * @param userId 用户ID
//  * @returns 处理后的响应数据
//  */
// export const borrowBook = async (copyId: string, userId: string) => {
//   try {
//     const res = await axios.post("/v1/book/borrow", {
//       copy_id: copyId,
//       user_id: userId,
//     });

//     if (res.data.code === 200) {
//       return {
//         success: true,
//         message: "借阅成功",
//       };
//     } else {
//       return {
//         success: false,
//         error: res.data.msg || "借阅失败",
//       };
//     }
//   } catch (error) {
//     console.error("借阅图书失败:", error);
//     return {
//       success: false,
//       error: "借阅图书失败，请稍后重试",
//     };
//   }
// };

// /**
//  * 归还图书
//  * @param copyId 副本ID
//  * @returns 处理后的响应数据
//  */
// export const returnBook = async (copyId: string) => {
//   try {
//     const res = await axios.post("/v1/book/return", {
//       copy_id: copyId,
//     });

//     if (res.data.code === 200) {
//       return {
//         success: true,
//         message: "归还成功",
//       };
//     } else {
//       return {
//         success: false,
//         error: res.data.msg || "归还失败",
//       };
//     }
//   } catch (error) {
//     console.error("归还图书失败:", error);
//     return {
//       success: false,
//       error: "归还图书失败，请稍后重试",
//     };
//   }
// };

// 生成模拟借阅记录数据
export const generateMockBorrowRecords = (pageSize: number) => {
  const data: BorrowRecordItem[] = [];
  const statusOptions: BorrowRecordItem["return_status"][] = [
    "waiting_return",
    "returned",
    "overdue",
  ];

  for (let i = 1; i <= 50; i++) {
    data.push({
      key: i.toString(),
      index: i,
      copy_id: `2023${i.toString().padStart(4, "0")}`,
      book_id: `书名${i}`,
      user_name: `用户${(i % 10) + 1}`,
      return_status: statusOptions[i % 3],
      should_return_time: `2025-${(i % 12) + 1}-${(i % 28) + 1}`,
      user_id: `U${i.toString().padStart(4, "0")}`,
    });
  }

  return {
    items: data,
    totalPages: Math.ceil(data.length / pageSize),
    total: data.length,
  };
};

// 生成模拟搜索结果数据
export const generateMockSearchResults = (pageSize: number) => {
  const data: BookItem[] = [];
  const categoryOptions: BookItem["category"][] = [
    "children_story",
    "science_knowledge",
    "art_enlightenment",
  ];

  for (let i = 1; i <= 20; i++) {
    data.push({
      key: i.toString(),
      index: i,
      copy_id: `2023${i.toString().padStart(4, "0")}`,
      book_id: `B${i.toString().padStart(4, "0")}`,
      name: `绘本${i}`,
      category: categoryOptions[i % 3],
      publisher: `出版社${(i % 5) + 1}`,
      author: `作者${(i % 8) + 1}`,
    });
  }

  return {
    items: data,
    totalPages: Math.ceil(data.length / pageSize),
    total: data.length,
  };
};
