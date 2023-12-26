import React, {Fragment, useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Modal, Provider} from 'react-native-paper';
import CustomStatus from '../../compenents/CustomStatus';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Dropdown} from 'react-native-element-dropdown';
import width from '../../Units/width';
import Fonts from '../../utility/Fonts';
import height from '../../Units/height';
import ApiMethod from '../../api/ApiMethod';
import CustomProgress from '../../compenents/CustomProgress';
import moment from 'moment';
import DocumentPicker from 'react-native-document-picker';
import ConstData from '../../utility/ConstData';
import ImageCropPicker from 'react-native-image-crop-picker';
import {styles} from 'react-native-gifted-charts/src/LineChart/styles';
import Pdf from 'react-native-pdf';
import {PermissionsAndroid} from 'react-native';

const weekAr = [
  {label: 'Week 1', value: 1},
  {label: 'Week 2', value: 2},
  {label: 'Week 3', value: 3},
  {label: 'Week 4', value: 4},
  {label: 'Week 5', value: 5},
  {label: 'Week 6', value: 6},
];

const UploadAssignment1Screen = ({navigation, route}) => {
  const [chapterData, setChapterData] = useState(route.params.data);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [assignmentTitle, setAssignmentTitle] = useState(null);
  const [showProgress, setShowProgress] = useState(false);
  const [showSelection, sethowSelection] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedImagesCamera, setSelectedImagesCamera] = useState([]);
  const [preview, setPreview] = useState(false);
  const [uploadMethod, setUploadMethod] = useState('');
  const [titleError, setTitleError] = useState(false);
  const [docs, setDocs] = useState([]);
  const [pdfPreview, setPdfPreview] = useState(false);
  console.log('***************', docs);
  console.log('chapterData', chapterData);

  useEffect(() => {
    setShowProgress(false);
  }, []);

  // checking title name //
  const checkTitleForPdf = () => {
    // if (assignmentTitle) {
    //   openDocPicker();
    // } else {
    //   setTitleError(true);
    // }
    openDocPicker();
  };

  const checkTitleForImage = () => {
    // if (assignmentTitle) {
    //   sethowSelection(true);
    // } else {
    //   setTitleError(true);
    // }
    sethowSelection(true);
  };

  const openDocPicker = () => {
    DocumentPicker.pickSingle({
      type: [DocumentPicker.types.pdf],
      //There can me more options as well
      // DocumentPicker.types.allFiles
      // DocumentPicker.types.images
      // DocumentPicker.types.plainText
      // DocumentPicker.types.audio
      // DocumentPicker.types.pdf
    })
      .then(res => {
        console.log('Res', res);
        setDocs(res);
        setPdfPreview(true);
      })
      .catch(err => {
        console.log('err', err);
      });
  };

  const handleCancel = () => {
    setPdfPreview(false);
    setPreview(false);
    setDocs([]);
  };
  const handlePicCancel = () => {
    setPdfPreview(false);
    setPreview(false);
    setSelectedImages([]);
  };
  const handleSave = uri => {
    setPdfPreview(false);
    setPreview(false);
    uploadDoc(1, docs.uri);
  };

  const openCamera = () => {
    ImageCropPicker.openCamera({
      multiple: true,
      maxFiles: 3,
      cropping: false,
    }).then(newImgs => {
      console.log('captured images', newImgs);

      // Ensure newImgs is an array before using map
      if (Array.isArray(newImgs)) {
        setSelectedImages([...selectedImages, ...newImgs.map(img => img.path)]);
      } else if (newImgs.path) {
        // If it's a single image, newImgs will not be an array
        setSelectedImages([...selectedImages, newImgs.path]);
      }

      setPreview(true);
    });
  };

  const openGallery = () => {
    ImageCropPicker.openPicker({
      multiple: true,
      cropping: false,
      mediaType: 'photo',
    }).then(newImgs => {
      console.log('Gallery images', newImgs);
      setSelectedImages([...selectedImages, ...newImgs.map(img => img.path)]);
      setPreview(true);
    });
  };

  const uploadDoc = (type, filePath) => {
    setShowProgress(true);
    const formData = new FormData();
    formData.append('syllabus_id', chapterData.id);
    formData.append('submit_date', moment().format('yyyy-MM-DD'));
    formData.append('type', type);
    formData.append('title', assignmentTitle);

    if (type == 1) {
      formData.append('assignment[]', {
        uri:
          Platform.OS === 'android'
            ? filePath
            : filePath.replace('file://', ''),
        type: 'application/*',
        name: `Doc_${Date.now()}.pdf`,
      });
    } else {
      filePath.forEach(item => {
        formData.append('assignment[]', {
          uri: Platform.OS === 'android' ? item : item.replace('file://', ''),
          type: 'image/*',
          name: `Doc_${Date.now()}.jpg`,
        });
      });
    }

    setShowProgress(true);
    ApiMethod.uploadAssignments(
      formData,
      pass => {
        setShowProgress(false);
        if (pass.status == '200') {
          console.log('************TRUE************', pass);
          setTimeout(() => {
            setShowSuccess(false);
            setSelectedImages([]);
            navigation.goBack();
          }, 1500);
          setShowSuccess(true);
        } else {
          console.log('************FALSE************', pass);
        }
      },
      fail => {
        setShowProgress(false);
      },
    );
  };
  const handleSubmit = () => {
    // Call the uploadDoc function with the selected images
    setPreview(false);
    setPdfPreview(false);
    console.log(
      '+++++++*********Image Upload******+++++++++++++',
      selectedImages,
    );
    uploadDoc(2, selectedImages);
  };

  const handleAllSubmit = () => {
    if (preview) {
      handleSubmit();
    } else {
      handleSave();
    }
  };
  const handleAllCancel = () => {
    if (preview) {
      handleCancel();
    } else {
      handlePicCancel();
    }
  };

  // const apiCall = () => {
  //   setShowProgress(true);
  //   ApiMethod.myAssignments(
  //     pass => {
  //       setShowProgress(false);
  //       console.log('pass', pass);
  //       if (pass.status == 200) {
  //         setChapterList(pass.data);
  //       } else {
  //         setChapterList([]);
  //       }
  //     },
  //     fail => {
  //       setShowProgress(false);
  //       setChapterList([]);
  //     },
  //   );
  // };

  const deleteImage = index => {
    const updatedImages = [...selectedImages];
    updatedImages.splice(index, 1);
    setSelectedImages(updatedImages);
    if (updatedImages.length === 0) {
      handleAllCancel(); // Call the function to handle cancel
    }
  };

  return (
    <Provider>
      <CustomStatus trans={true} isDark={true} color="#FFFFFF" />
      <View style={{flex: 1}}>
        <View
          style={{
            width: '100%',
            height: 10 * height,
            backgroundColor: '#FFFFFF',
            paddingHorizontal: 6 * width,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: '#000000',
              fontFamily: Fonts.SemiBold,
              fontSize: 4.5 * width,
            }}>
            {'Upload Assignment'}
          </Text>

          <TouchableOpacity
            onPress={navigation.goBack}
            style={{
              width: 9 * width,
              height: 9 * width,
              margin: 2 * width,
              borderRadius: 2 * width,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#EFFFF6',
            }}>
            <Ionicons name="chevron-back" size={5 * width} color="#000000" />
          </TouchableOpacity>
        </View>

        <View
          style={{width: '100%', height: 1 * width, backgroundColor: '#F5F5F5'}}
        />
        <View
          style={{
            flex: 1,
            width: '100%',
            backgroundColor: '#FFFFFF',
            paddingVertical: 3 * width,
            paddingHorizontal: 5 * width,
          }}>
          <Text style={Styles.headerText1}>{'Assigned On'}</Text>
          <Text style={Styles.weekText}>
            {chapterData.assigned_date
              ? `${moment(chapterData.assigned_date).format('MMM DD')}`
              : 'N/A'}
          </Text>

          <Text style={Styles.headerText1}>{'Submission On'}</Text>
          <Text style={Styles.weekText}>{`${moment().format('MMM DD')}`}</Text>

          {/* <Text style={Styles.headerText1}>{'Assignment Title'}</Text>

          <TouchableOpacity
            style={{
              width: '100%',
              height: 6.5 * height,
              // backgroundColor: '#16763E11',
              borderWidth: 1,
              marginTop: 1 * width,
              borderRadius: 3 * width,
              borderColor: '#c0c0c0',
              // alignItems: 'center',
              justifyContent: 'center',
            }}>
            <TextInput
              placeholder="Enter Title"
              placeholderTextColor={'#969696'}
              onBlur={() => setTitleError(false)}
              style={{
                fontSize: 13,
                color: '#000000',
                paddingHorizontal: width * 5,
              }}
              value={assignmentTitle}
              onChangeText={text => setAssignmentTitle(text)}
            />
          </TouchableOpacity>
          {titleError && (
            <Text style={Styles.assignTitleText}>
              {'Please enter title of your assignment first !'}
            </Text>
          )} */}

          <Text style={Styles.headerText1}>{'Assignment'}</Text>

          <TouchableOpacity
            onPress={() => {
              checkTitleForPdf();
            }}
            style={{
              width: '100%',
              height: 8 * height,
              backgroundColor: '#16763E11',
              borderWidth: 1,
              marginTop: 1 * width,
              borderRadius: 3 * width,
              borderStyle: 'dashed',
              borderColor: '#16763E',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={Styles.markDoneText}>{`Upload PDF`}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              checkTitleForImage();
            }}
            style={{
              width: '100%',
              height: 8 * height,
              backgroundColor: '#16763E11',
              borderWidth: 1,
              marginTop: 3 * height,
              borderRadius: 3 * width,
              borderStyle: 'dashed',
              borderColor: '#16763E',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={Styles.markDoneText}>{`Upload JPG`}</Text>
          </TouchableOpacity>

          {/* Submit button 
          <TouchableOpacity
            onPress={() => {
              // Call the uploadDoc function with the selected images
              selectedImages.forEach(imgPath => uploadDoc(imgPath));
            }}
            style={{
              width: '100%',
              height: 8 * height,
              backgroundColor: '#16763E11',
              borderWidth: 1,
              marginTop: 3 * height,
              borderRadius: 3 * width,
              borderStyle: 'dashed',
              borderColor: '#16763E',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={Styles.markDoneText}>{`Submit`}</Text>
          </TouchableOpacity>  */}

          {(preview || pdfPreview) && (
            <View>
              <View
                style={{
                  width: '100%',
                  height: '50%',
                  alignSelf: 'center',
                  borderRadius: 2 * width,
                  backgroundColor: '#FFFFFF',
                  // paddingHorizontal: 3 * width,
                  // paddingVertical: 3 * width,
                  flexDirection: 'row',
                  borderColor: '#16763E',
                  borderWidth: 1,
                  marginTop: width * 3,
                  padding: width * 1,
                }}>
                {preview && (
                  <ScrollView
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    style={{marginTop: 10}}>
                    {/* Display selected images */}
                    {selectedImages.map((item, index) => (
                      <View key={index} style={{flexWrap: 'wrap'}}>
                        <View style={{height: width * 2}} />
                        <Image
                          // key={index}
                          source={{uri: item}}
                          style={{
                            // flex: 1,
                            width: width * 40,
                            height: width * 40,
                            resizeMode: 'stretch',
                            marginLeft: width * 3,
                            // alignSelf: 'center',
                          }}
                        />
                        <TouchableOpacity
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 5,
                          }}
                          onPress={() => deleteImage(index)}>
                          <Icon name="times" size={20} color="#000000" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </ScrollView>
                )}
                {pdfPreview && (
                  <View
                    style={{
                      // flex: 1,
                      width: '100%',
                      height: '30%',
                      // alignSelf: 'center',
                      borderRadius: 2 * width,
                      // backgroundColor: '#FFFFFF',
                      // paddingHorizontal: 3 * width,
                      flexDirection: 'row',
                      alignItems: 'center',
                      // justifyContent: 'center',
                      alignSelf: 'center',
                      // marginLeft: -width * 10,
                      borderColor: 'red',
                      borderWidth: 1,
                    }}>
                    <Image
                      style={{
                        width: width * 12,
                        height: width * 12,
                        // marginLeft: -width * 3,
                      }}
                      source={require('../../assets/images/pdf.png')}
                    />
                    <Text style={{color: '#000000', marginLeft: width * 3}}>
                      {docs.name.length > 50
                        ? `${docs.name.substring(0, 35)}...`
                        : docs.name}
                    </Text>
                  </View>
                )}
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  marginHorizontal: width * 20,
                  justifyContent: 'space-between',
                }}>
                <TouchableOpacity
                  onPress={() => handleAllCancel()}
                  style={{
                    marginTop: width * 5,
                    alignSelf: 'center',
                    backgroundColor: '#16763E11',
                    borderRadius: 2 * width,
                  }}>
                  <Text
                    style={{
                      paddingHorizontal: width * 3.5,
                      paddingVertical: width * 1,
                      color: '#008A3D',
                      fontSize: 13,
                    }}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleAllSubmit()}
                  style={{
                    marginTop: width * 5,
                    alignSelf: 'center',
                    backgroundColor: '#008A3D',
                    borderRadius: 2 * width,
                  }}>
                  <Text
                    style={{
                      paddingHorizontal: width * 3.5,
                      paddingVertical: width * 1,
                      color: '#ffffff',
                      fontSize: 13,
                    }}>
                    Submit
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>

      <Modal
        visible={showSelection}
        transparent
        onRequestClose={() => sethowSelection(false)}
        onDismiss={() => sethowSelection(false)}>
        <View
          style={[
            {
              width: '70%',
              borderRadius: 2 * width,
              backgroundColor: '#F7F7F7',
              paddingVertical: 1 * height,
              paddingHorizontal: 2 * height,
              alignSelf: 'center',
              alignItems: 'center',
              // justifyContent: 'center',
            },
            ConstData.ELEVATION_STYLE,
          ]}>
          <Text
            style={{
              width: '100%',
              textAlign: 'center',
              paddingVertical: 1 * height,
              color: '#232323',
              fontSize: 4 * width,
              fontWeight: '600',
              marginTop: 1 * height,
            }}>
            Choose From
          </Text>
          <View style={{width: '90%', height: 2, backgroundColor: '#888888'}} />
          <View
            style={{
              flexDirection: 'row',
              marginTop: 2 * height,
            }}>
            <TouchableOpacity
              onPress={() => {
                sethowSelection(false);
                openCamera();
              }}
              style={{
                flex: 1,
                height: 10 * height,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f0f0f0',
                margin: 1 * width,
                borderRadius: 2 * width,
              }}>
              <Feather name="camera" color={'#232323'} size={6 * width} />
              <Text
                style={{
                  color: '#232323',
                  fontSize: 3 * width,
                  fontWeight: '600',
                  marginTop: 1 * height,
                }}>
                Camera
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                sethowSelection(false);
                openGallery();
              }}
              style={{
                flex: 1,
                height: 10 * height,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f0f0f0',
                margin: 1 * width,
                borderRadius: 2 * width,
              }}>
              <Feather name="image" color={'#232323'} size={6 * width} />
              <Text
                style={{
                  color: '#232323',
                  fontSize: 3 * width,
                  fontWeight: '600',
                  marginTop: 1 * height,
                }}>
                Gallery
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => sethowSelection(false)}
            style={{
              // flex: 1,
              height: 3 * height,
              alignItems: 'center',
              justifyContent: 'center',
              // backgroundColor: '#f0f0f0',
              margin: 2 * width,
              paddingHorizontal: 2 * width,
              borderRadius: 2 * width,
            }}>
            <Text
              style={{
                color: '#FF0011',
                fontSize: 3 * width,
                fontWeight: '600',
              }}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal visible={showSuccess} onDismiss={() => setShowSuccess(false)}>
        <View
          style={{
            width: '80%',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 4 * height,
            backgroundColor: '#FFFFFF',
            borderRadius: 4 * width,
            alignSelf: 'center',
          }}>
          <View
            style={{
              width: 7 * height,
              height: 7 * height,
              borderRadius: 5 * height,
              backgroundColor: '#008A3D',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Feather name="check" size={8 * width} color="#FFFFFF" />
          </View>

          <Text
            style={{
              fontFamily: Fonts.Medium,
              fontSize: 3.4 * width,
              color: '#000000',
              marginTop: 3 * height,
            }}>
            {'Assignment Submitted!'}
          </Text>
        </View>
      </Modal>
      <CustomProgress show={showProgress} />
    </Provider>
  );
};

const Styles = StyleSheet.create({
  headerText: {
    color: '#000000',
    fontSize: 4.4 * width,
    fontFamily: Fonts.SemiBold,
    // marginTop: 2 * width,
  },

  headerText1: {
    color: '#000000',
    fontSize: 4 * width,
    fontFamily: Fonts.SemiBold,
    marginTop: 2 * width,
  },
  weekText: {
    color: '#969696',
    fontSize: 3.4 * width,
    fontFamily: Fonts.Regular,
    // marginTop: 2 * width,
  },
  uploadText: {
    color: '#FFFFFF',
    fontSize: 3.4 * width,
    fontFamily: Fonts.Regular,
    // marginTop: 2 * width,
  },
  uploadTextGrey: {
    color: '#888686',
    fontSize: 3.4 * width,
    fontFamily: Fonts.Regular,
    // marginTop: 2 * width,
  },
  markDoneText: {
    color: '#008A3D',
    fontSize: 3.4 * width,
    fontFamily: Fonts.Medium,
    // marginTop: 2 * width,
  },
  markNotDoneText: {
    color: '#888686',
    fontSize: 3.4 * width,
    marginStart: 2 * width,
    fontFamily: Fonts.Medium,
    // marginTop: 2 * width,
  },
  assignTitleText: {
    color: '#fc4b4b',
    fontSize: 3 * width,
    fontFamily: Fonts.SemiBold,
    marginTop: 1 * width,
    textAlign: 'center',
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
  },
  image: {
    width: width * 15,
    height: width * 15,
    resizeMode: 'cover',
    marginLeft: width * 3,
    // alignSelf: 'center',
  },
  deleteButton: {
    position: 'absolute',
    top: 0,
    right: 10,
    // backgroundColor: 'red',
    // borderRadius: 12,
    // padding: 4,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
});
export default UploadAssignment1Screen;
