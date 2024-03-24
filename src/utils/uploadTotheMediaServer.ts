import axios from '../core/axios';

export const uploadProductFileImg = async (file: Exclude<any, File | boolean>) => {
  const formData = new FormData();
  formData.append('file', file);

  const values = { email: 'denkluch88@gmail.com', password: 'lublukiski777' };

  const url = '/cloud/store/files/uploadFile';

  try {
    const jwtToken = (await axios.post('/cloud/store/auth/signin', values)).data;
    const res = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${jwtToken}`,
      },
    });
    return { imgUrl: `https://snakicz-bot.net/cloud/store/uploads/den4ik/${res.data.fileName}` };
  } catch (e) {
    throw new Error(e?.toString());
  }
};
