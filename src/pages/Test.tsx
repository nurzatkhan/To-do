import { useSnackbar } from 'notistack'
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import { useForm } from "react-hook-form";
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";
import axios from 'axios';
import useTodo from '../hooks/query-hooks/tode';
import { useMutation } from 'react-query';
import { v4 as uuidv4 } from 'uuid';

const schema = z.object({
    value: z.string().max(32).min(2)
});
type StringType = z.infer<typeof schema>;

function Test() {
    const { enqueueSnackbar } = useSnackbar();
    const { handleSubmit, formState: { errors }, register, reset } = useForm<{ value: string }>({
        resolver: zodResolver(schema)
    });
    const { data, refetch } = useTodo()
    function PostFormData({ value }: StringType) {
        mutate({ value });
    }
    const { mutate } = useMutation(
        async ({ value }: { value: string }) => {
            await axios.post(`http://localhost:3000/todo`, {
                id: uuidv4(),
                value: value,
                created_at: String(new Date),
                update_at: String(new Date)
            }).then((res) => res.data);
        },
        {
            onSuccess: () => {
                enqueueSnackbar('success', { variant: `success` });
                refetch()
                reset()
            },
            onError: (e) => {
                console.log(e)
                enqueueSnackbar('error', { variant: `error` });
            }
        },
    );
    const { mutate: deleteMutateData } = useMutation(
        async ({ id }: { id: string }) => {
            await axios.delete(`http://localhost:3000/todo/${id}`).then((res) => res.data);
        },
        {
            onSuccess: () => {
                enqueueSnackbar('success', { variant: `success` });
                refetch()
                reset()
            },
            onError: (e) => {
                console.log(e)
                enqueueSnackbar('error', { variant: `error` });
            }
        },
    );
    if (!data) {
        return null
    }
    return (
        <div style={{
            width: '100%',
            display: "flex",
            flexDirection: 'column',
            alignItems: 'center',
        }}>
            <Typography variant="h1">To Do List</Typography>
            <form onSubmit={handleSubmit(PostFormData)} className="form">
                <TextField
                    label="enter value todo"
                    size='small'
                    {...register("value")}
                    sx={{ width: "330px" }}
                    error={!!errors.value}
                    helperText={errors?.value?.message || ''} />
                <Button variant="outlined" type="submit">Save</Button>
            </form>
            {data.map((data) =>
                <Paper sx={{ width: "666px", padding: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: "space-between", alignItems: 'center' }}>
                        <Typography variant="h5" justifyContent="center">{data.value}</Typography>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            <div>
                                <Typography
                                    variant="inherit"
                                    gutterBottom
                                >
                                    {(`${new Date(data.created_at).getDate()}.${new Date(data.created_at).getMonth()}. ${new Date(data.created_at).getFullYear()}`)}
                                </Typography>
                                <Typography
                                    variant="inherit"
                                    gutterBottom
                                >
                                    {(`${new Date(data.update_at).getDate()}.${new Date(data.update_at).getMonth()}. ${new Date(data.update_at).getFullYear()}`)}
                                </Typography>
                            </div>
                            <Button
                                sx={{ marginLeft: '15px' }}
                                variant="outlined"
                                startIcon={<DeleteIcon />}
                                onClick={() => deleteMutateData({ id: data.id })}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                </Paper>
            )}
        </div>
    )
}

export default Test