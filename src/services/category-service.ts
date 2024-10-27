import { api } from 'boot/axios';
import { Category } from 'src/ts/interfaces/data/Category';

const baseUrl = 'category';

// export const getDepartmentsService = async (): Promise<{
//     status: number;
//     data: {
//         departments: Array<IDepartment>;
//         message: string;
//     };
// }> => {
//     return await api.get(`${baseUrl}`);
// };
export const createCategoryService = (
  payload: string,
): Promise<{
    status: number;
    data: {
        categories: Category[];
        message: string;
    };
}> => api.post(`${baseUrl}/`, payload);
// export const updateDepartmentService = async (payload: {
//     id: string;
//     name: string;
//     parent: string | null;
// }): Promise<{
//     status: number;
//     data: {
//         departments: Array<IDepartment>;
//         message: string;
//     };
// }> => {
//     return await api.put(`${baseUrl}/`, payload);
// };
export const deleteCategoryService = (
  id: string,
): Promise<{
    status: number;
    data: {
        message: string;
    };
}> => api.delete(`${baseUrl}/${id}`);
