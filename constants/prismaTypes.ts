import { ListenerProfile, User } from '@prisma/client';

export type PublicUser = Pick<
  User,
  'id' | 'email' | 'nickname' | 'profilePicture'
> & {
  listenerProfile: ListenerProfile | null;
  firstName?: string;
  displayName: string;
};
