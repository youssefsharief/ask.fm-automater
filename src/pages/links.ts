import { config } from '../config/config';

function getProfilePage(userId) {
    return `${config.action.mainWebPage}/${userId}/ask`;
}

export const links = {
    getProfilePage,
};
