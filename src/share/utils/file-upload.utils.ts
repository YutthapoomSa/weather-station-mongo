import moment from 'moment';
import { basename, extname } from 'path';
import { LogService } from '../../services/log.service';

const logger = new LogService('FileUploadUtils');

export const imageFileFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/)) {
        logger.error(`Error: File upload only supports images -> ${file.originalname}`);
        return callback(new Error('Only image files are allowed!'), false);
    }
    callback(null, true);
};

export const editFileName = (req, file, cb) => {
    const randomName = Array(32)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
    return cb(null, `${randomName}${extname(file.originalname)}`);
};

// [
//     {
//       fieldname: 'images',
//       originalname: 'cleaner.jpeg',
//       encoding: '7bit',
//       mimetype: 'image/jpeg',
//       destination: '/Users/burmdev/Documents/burmdev/tracking-documents-backend/upload/doc',
//       filename: '4ae414514cbdc9b10917dc52a6287119c.jpeg',
//       path: '/Users/burmdev/Documents/burmdev/tracking-documents-backend/upload/doc/4ae414514cbdc9b10917dc52a6287119c.jpeg',
//       size: 139211
//     }
//   ]

export const editFileNameStemTime = (req, file, cb) => {
    const _file = `${file.originalname}`.split('.');
    return cb(null, `${_file[0]}_${moment().format('YYYYMMDDHHmm')}${extname(file.originalname)}`);
};
