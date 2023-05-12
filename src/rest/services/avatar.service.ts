import util from 'util'
import https from 'https'

const getSvgImage = util.promisify((fileName: string, callback: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    const url = `https://api.dicebear.com/6.x/identicon/svg?seed=${fileName}`;
    try {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                callback(null, data);
            });
        }).on('error', (err) => {
            callback(err);
        });
    } catch (error) {
        console.log(error);
        callback(error)
    }
});

export { getSvgImage };