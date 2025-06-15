import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/wiki';

// TODO: 返回类型有待更正
export interface ResourceItem {
  id: number | string; 
  name: string;
  [key: string]: any; // 允许有其他任意字段
}

/**
 * 获取指定游戏和资源的列表。
 * @param gameId - 游戏的ID (例如: 'genshin', 'starrail')
 * @param resource - 资源的类型 (例如: 'characters', 'weapons')
 * @returns 返回一个包含资源条目数组的 Promise
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