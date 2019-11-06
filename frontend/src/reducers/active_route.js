export const initialState = '/';

export function activeRouteReducer(state=initialState, action) {
    if(!action.payload)
        return '/new_post';
    return action.payload;
}