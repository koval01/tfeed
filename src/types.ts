interface AuthResponse {
    token: string;
}

interface ProfileStatusResponse {
    profile: string | null;
}

export interface ProfilePicture {
    id: string;
    url: string;
    createdAt: number;
}

export interface ProfileDetails {
    id: string;
    displayName: string;
    telegram: number;
    role: string;
    verified: boolean;
    description: string;
    visible: boolean;
    avatar: string | null;
    createdAt: number;
    city: string;
    country: string;
    personality: string;
}

export interface ProfileNear {
    id: string;
    displayName: string;
    city: string;
    country: string;
    avatar: string | null;
    metadata: {
        distance: number | null;
    }
}

export interface UpdateProfileProps {
    visible: boolean;
    displayName: string;
    description: string;
    city: string;
    country: string;
    personality: string
}

export interface SetProfileAvatarProps {
    picture: {
        id: string;
        url: string
    }
}

export interface UploadProfilePictureProps {
    id: string;
    url: string
}

interface ApiResponse<T> {
    status: string;
    data: T;
}
