import axios from "src/api/axios";
import { message } from "antd";

export interface InventoryItem {
  key: string;
  index: number;
  book_id: string;
  name: string;
  author: string;
  publisher: string;
  category: string;
  stock: number;
  stock_status: "充足" | "预警" | "短缺";
  created_at: string;
}

export interface SearchParams {
  author?: string;
  book_id?: number;
  category?: string;
  name?: string;
  page: number;
  page_size: number;
}

export interface ApiResponse {
  code: number;
  data: {
    books: InventoryItem[];
    current_page: number;
    total_page: number;
  };
  msg: string;
}

/**
 * 获取库存数据
 * @param params 查询参数，必须包含page和page_size
 * @returns 处理后的响应数据
 */
// 获取库存数据的函数
export const fetchInventoryData = async (params: SearchParams) => {
  // 验证必填参数
  if (params.page === undefined || params.page_size === undefined) {
    console.error("fetchInventoryData: page和page_size是必填参数");
    return {
      success: false,
      error: "请求参数错误：缺少分页信息",
    };
  }

  try {
    // 从localStorage获取认证token
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      message.error("认证失败，请重新登录");
      return {
        success: false,
        error: "认证失败",
        needLogin: true,
      };
    }

    // 确保请求参数中包含page和page_size
    const requestParams = {
      ...params,
      page: params.page,
      page_size: params.page_size,
    };

    const res = await axios.get<ApiResponse>("/v1/book/stock/fuzzy_query", {
      params: requestParams,
      headers: {
        Authorization: authToken,
      },
    });

    if (res.data.code === 200) {
      const { books, current_page, total_page } = res.data.data;

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
          total: total_page * params.page_size, // 估算总数
        },
      };
    } else {
      return {
        success: false,
        error: res.data.msg || "获取数据失败",
      };
    }
  } catch (error) {
    console.error("获取库存数据失败:", error);
    return {
      success: false,
      error: "获取库存数据失败，请稍后重试",
    };
  }
};

/**
 * 删除库存数据
 * @param bookId 绘本ID
 * @returns 处理后的响应数据
 */
export const deleteInventoryItem = async (bookId: string) => {
  try {
    // 从localStorage获取认证token
    const authToken = localStorage.getItem("authToken")
    if (!authToken) {
      message.error("认证失败，请重新登录")
      return {
        success: false,
        error: "认证失败",
        needLogin: true,
      }
    }

    const res = await axios.delete(`/v1/book/stock/delete/${bookId}`, {
      headers: {
        Authorization: authToken,
      },
    })

    if (res.data.code === 200) {
      return {
        success: true,
        message: "删除成功",
      }
    } else {
      return {
        success: false,
        error: res.data.msg || "删除失败",
      }
    }
  } catch (error) {
    console.error("删除库存数据失败:", error)
    return {
      success: false,
      error: "删除库存数据失败，请稍后重试",
    }
  }
}

/**
 * 更新库存数据
 * @param bookId 绘本ID
 * @param data 更新的数据
 * @returns 处理后的响应数据
 */
export const updateInventoryItem = async (bookId: string, data: Partial<InventoryItem>) => {
  try {
    // 从localStorage获取认证token
    const authToken = localStorage.getItem("authToken")
    if (!authToken) {
      message.error("认证失败，请重新登录")
      return {
        success: false,
        error: "认证失败",
        needLogin: true,
      }
    }

    const res = await axios.put(`/v1/book/stock/update/${bookId}`, data, {
      headers: {
        Authorization: authToken,
      },
    })

    if (res.data.code === 200) {
      return {
        success: true,
        message: "更新成功",
      }
    } else {
      return {
        success: false,
        error: res.data.msg || "更新失败",
      }
    }
  } catch (error) {
    console.error("更新库存数据失败:", error)
    return {
      success: false,
      error: "更新库存数据失败，请稍后重试",
    }
  }
}


// 生成模拟数据的函数
export const generateMockData = (pageSize: number) => {
  const data: InventoryItem[] = [];
  for (let i = 1; i <= 300; i++) {
    data.push({
      key: i.toString(),
      index: i,
      book_id: `2023${i.toString().padStart(4, "0")}`,
      name: `绘本${i}`,
      author: `作者${(i % 10) + 1}`,
      publisher: `出版社${(i % 5) + 1}`,
      category: i % 3 === 0 ? "儿童故事" : i % 3 === 1 ? "科普知识" : "艺术启蒙",
      stock: Math.floor(Math.random() * 200) + 1,
      stock_status: i % 3 === 0 ? "充足" : i % 3 === 1 ? "预警" : "短缺",
      created_at: `2025-${(i % 12) + 1}-${(i % 28) + 1}`,
    });
  }
  return {
    items: data,
    totalPages: Math.ceil(data.length / pageSize),
    total: data.length,
  };
};
