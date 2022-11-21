import { useQuery, UseQueryOptions } from 'react-query';
import axios from 'axios';
export type todoType = {
    id: string,
    value: string,
    created_at: string,
    update_at: string
}
const useTodo = (configs?: Omit<UseQueryOptions<todoType[]>, 'queryFn' | 'queryKey'>) => {
    return useQuery(['todo'], () => {
        return axios.get<todoType[]>(`http://localhost:3000/todo`).then((res) => res.data);
    });
};

export default useTodo;
