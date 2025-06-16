import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/wiki';

// 返回类型仅显式声明了buffs表中的字段，其他字段不显式声明，但允许存在
export interface ResourceItem {
  id: number | string; 
  type: string;
  buff_id: number | string;
  name: string;
  description: string;
  comment: string;
  [key: string]: any;
}

/**
 * 获取指定游戏和资源的列表。
 * @param gameId - 游戏的ID
 * @param resource - 资源的类型 (例如: 'buffs')
 * @returns 返回一个包含资源条目数组的 Promise（是 ResourceItem[] 类型）
 * @throws 如果请求失败，会抛出一个错误
 */
export const fetchResourceList = async (gameId: string, resource: string): Promise<ResourceItem[]> => {
  try {
    const url = `${API_BASE_URL}/${gameId}/${resource}`;
    console.log(`正在请求: ${url}`);

    const response = await axios.get<ResourceItem[]>(url);
   
    return response.data;

  } catch (error) {
    console.error(`获取资源列表失败 (game: ${gameId}, resource: ${resource}):`, error);
   
    throw error;
  }
};

export interface PaginatedResourceResponse {
  list: ResourceItem[];
  total: number;
}

/**
 * 获取指定游戏和资源的分页列表。
 * @param gameId - 游戏的ID。
 * @param resource - 资源的类型 (例如: 'buffs')。
 * @param page - 当前请求的页码。
 * @param pageSize - 每页请求的数量。
 * @returns 返回一个包含列表和总数的对象的 Promise。
 * @throws 如果请求失败，会抛出一个错误。
 */
export const fetchPaginatedResourceList = async (
  gameId: string,
  resource: string,
  page: number,
  pageSize: number
): Promise<PaginatedResourceResponse> => {
  try {
    const url = `${API_BASE_URL}/${gameId}/${resource}/paginated`;
    console.log(`正在请求分页数据: ${url} (Page: ${page}, PageSize: ${pageSize})`);

    const response = await axios.get<{
      code: number;
      message: string;
      data: PaginatedResourceResponse;
    }>(url, {
      params: {
        page,
        pageSize,
      },
    });

    // 根据你后端的返回格式 { code, message, data: { list, total } }
    if (response.data && response.data.code === 200) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || '获取分页数据失败');
    }

  } catch (error) {
    console.error(`获取分页资源列表失败 (game: ${gameId}, resource: ${resource}):`, error);
    throw error;
  }
};

export const searchInResourceList = async (
  gameId: string,
  resource: string,
  field: string,
  keyword: string
): Promise<PaginatedResourceResponse> => {
  try {
    const url = `${API_BASE_URL}/${gameId}/${resource}/search`;
    console.log(`正在请求搜索数据: ${url} (Field: ${field}, Keyword: ${keyword})`);

    const response = await axios.get<{
      code: number;
      message: string;
      data: PaginatedResourceResponse;
    }>(url, {
      params: {
        field,
        keyword,
      },
    });

    if (response.data && response.data.code === 200) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || '获取搜索数据失败');
    }
  } catch (error) {
    console.error(`搜索资源列表失败 (game: ${gameId}, resource: ${resource}):`, error);
    throw error;
  }
}

/**
 * 获取所有游戏列表 (调用 /api/wiki/games)
 */
export interface GameInfo {
  id: string; 
  name: string;
  status: string;
  image_url: string;
  [key: string]: any;
}

export const fetchGames = async (): Promise<GameInfo[]> => {
  try {
      const url = `${API_BASE_URL}/games`;
      console.log(`正在请求: ${url}`);
      const response = await axios.get<GameInfo[]>(url);
      return response.data;
  } catch (error) {
      console.error('获取游戏列表失败:', error);
      throw error;
  }
}

export interface GameName {
  name: string;
  [key: string]: any;
}

export const fetchGameNameById = async (gameId: string): Promise<GameName> => {
  try {
    const url = `${API_BASE_URL}/games/getGameNameById?gameId=${gameId}`;
    console.log(`正在请求: ${url}`);
    const response = await axios.get<GameName>(url);
    return response.data;
  } catch (error) {
    console.error(`获取游戏名称失败 (gameId: ${gameId}):`, error);
    throw error;
  }
}