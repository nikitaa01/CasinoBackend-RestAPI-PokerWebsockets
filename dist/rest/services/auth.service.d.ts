import Response from '../types/response.type';
declare const getGoogleAuthURL: () => string;
declare const getGoogleToken: (code: string) => Response<{
    access_token: string;
    id_token: string;
}>;
declare const getGoogleProfile: (access_token: string, id_token: string) => Response<{
    given_name: string;
    family_name: string;
    email: string;
    id: string;
    picture: string;
}>;
export { getGoogleAuthURL, getGoogleToken, getGoogleProfile };
