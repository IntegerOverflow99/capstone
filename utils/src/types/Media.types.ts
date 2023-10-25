import * as Chance from 'chance';
import { IVideoDBModel, IVideoJSONModel } from './Video.types';
import { IPhotoDBModel, IPhotoJSONModel } from './Photo.types';
import { IAudioDBModel, IAudioJSONModel } from './Audio.types';

export type IMediaDBModel = {
  id: number;
  file_location: string;
};

export type IMediaJSONModel = {
  video?: IVideoJSONModel;
  audio?: IAudioJSONModel;
  photo?: IPhotoJSONModel;
  id?: number;
} & IMediaDBModel;

export const MediaGenerator = (chance: Chance.Chance, id: number) => ({
  id: id,
  file_location: chance.url(),
});
