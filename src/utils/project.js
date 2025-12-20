import Cookies from 'js-cookie';

export function setCurrentProjectId(projectId) {
    Cookies.set('currentProjectId', projectId);
}

export function getCurrentProjectId() {
    return Cookies.get('currentProjectId') || '';
}
