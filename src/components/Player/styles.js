import styled from 'styled-components/native';


export const Container = styled.View`
  flex-direction: row;
  background-color: ${props => props.pickedColour};
  backgroundGradient: vertical;
  backgroundGradientTop: #333333";
  backgroundGradientBottom: #666666;
  width: 100%;
  padding: 5px 0px 5px;
  border-radius: 20px;
  shadowOpacity: 30;
  shadowRadius: 20px;
  shadowOffset: { height: 8px, width: 0px };
  
`;

export const BarStatus = styled.View`
  background-color: #202020;
  position: absolute;
  height: 5%;
  width: 100%;
`;

export const Line = styled.View`
  background-color: #fff;
  position: absolute;
  height: 100%;
  width: ${props => props.progress}%;
`;

export const PhotoAlbum = styled.Image.attrs({
  resizeMode: 'contain',
})`
  width: 20%;
  border-radius: 20;
  shadowColor: #363533;
  zIndex:  0;
  shadowOpacity: 1.8;
  shadowRadius: 12px;
  shadowOffset: { height: 8px, width: 0px }

  
`;

export const Music = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
`;

export const Information = styled.View`
  align-items: flex-start;
  padding: 2px;
  flex: 4;
`;

export const InformationAlbum = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
`;

export const TitleMusic = styled.Text`
  color: #fff;
  font-size: 14px;
`;

export const Separator = styled.Text`
  color: #fff;
  font-size: 14px;
`;

export const AuthorName = styled.Text`
  color: #a3a3a3;
  font-size: 14px;
`;

export const InformationController = styled.TouchableOpacity`
  padding: 9px 0px 0px;
  flex-direction: row;
  flex: 1;
`;

export const DescriptionDevices = styled.Text`
  color: #fff;
  font-size: 11px;
  margin-left: 5px;
`;

export const Controller = styled.TouchableOpacity`
  flex: 1;
  align-items: flex-end;
  justify-content: center;
  padding: 10px;
`;
