import { StyleSheet, Platform } from 'react-native';
import Color from './Colors';
import t from 'tcomb-form-native'
import _ from 'lodash'
import {ScaledSheet, moderateScale} from 'react-native-size-matters'

// clone the default stylesheet
const stylesheet = _.cloneDeep(t.form.Form.stylesheet);
stylesheet.textbox.normal.flex = 1;
stylesheet.textbox.normal.fontSize = 13;
stylesheet.textbox.error.flex = 1;
stylesheet.textbox.error.fontSize = 13;
stylesheet.formGroup.normal.flex = 1;
stylesheet.formGroup.error.flex = 1;
stylesheet.formGroup.normal.marginHorizontal = 15;
stylesheet.formGroup.error.marginHorizontal = 15;
stylesheet.errorBlock.fontSize = 14;
stylesheet.errorBlock.color = Color.danger;
stylesheet.controlLabel.normal.fontSize = 12;
stylesheet.controlLabel.normal.fontWeight= 'bold';
stylesheet.controlLabel.error.fontSize = 12;
stylesheet.controlLabel.error.fontWeight= 'bold';

const stylesheetUnderline = _.cloneDeep(t.form.Form.stylesheet);
stylesheetUnderline.textbox.normal = {
  borderWidth:0,
  // flex:1,
  color:'#fff'
};
stylesheetUnderline.textbox.error = {
  borderWidth:0,
  // flex:1,
  color:'#fff'
};
stylesheetUnderline.textboxView.normal = {
  borderWidth:0,
  borderBottomWidth:1,
  borderBottomColor: '#fff',
  borderRadius:0,
  paddingBottom: 10,
};
stylesheetUnderline.textboxView.error = {
  borderWidth:0,
  borderBottomWidth:1,
  borderBottomColor: Color.danger,
  borderRadius:0,
  paddingBottom: 10
};
const stylesheetAllSize = _.cloneDeep(t.form.Form.stylesheet);
stylesheetAllSize.textbox = {
  normal: {
    backgroundColor:'transparent',
   
    // paddingVertical: 8, 
    borderWidth:1,
    borderRadius:20,
    borderColor:'#ffffff',
    color:'#ffffff',
    height:moderateScale(30),
    flex:1,
    fontSize: 18,
  },
  error: {
    backgroundColor:'transparent',
   
    // paddingVertical: 8, 
    borderWidth: 1,
    borderRadius:20,
    borderColor:'#ffffff',
    color:'#ffffff',
    height:moderateScale(30),
    flex:1,
    fontSize: 18,
  },
}

const stylesheetBackgroundTransparentBot = _.cloneDeep(t.form.Form.stylesheet);
stylesheetBackgroundTransparentBot.textbox = {
  normal: {
    backgroundColor:'transparent',
    paddingHorizontal: 10,
    paddingVertical: 8, 
    borderWidth:1,
    borderRadius:20,
    borderColor:'#ffffff',
    color:'#ffffff',
    height:50,
    flex:1,
    fontSize: 18,
    textAlign: 'center'
  },
  error: {
    backgroundColor:'transparent',
    paddingHorizontal: 7,
    paddingVertical: 8, 
    borderWidth: 1,
    borderRadius:20,
    borderColor:'#ffffff',
    color:'rgba(0,0,0,0.8)',
    height:50,
    flex:1,
    fontSize: 18,
    textAlign: 'center'
  },
}

const stylesheetBackgroundTransparentProfile = _.cloneDeep(t.form.Form.stylesheet);

stylesheetBackgroundTransparentProfile.textbox = {
  normal: {
    backgroundColor:'transparent',
    paddingHorizontal: 10,
    paddingVertical: 8, 
    color:'rgba(0,0,0,0.8)',
    height:40,
    flex:1,
    fontSize: 18,
  },
  error: {
    backgroundColor:'transparent',
    paddingHorizontal: 7,
    paddingVertical: 8, 
    color:'rgba(0,0,0,0.8)',
    height:40,
    flex:1,
    fontSize: 18,
  },
}

stylesheetBackgroundTransparentProfile.formGroup = {
  normal:{
    flex:1,
    marginBottom:10
  },
  error:{
    flex:1,
    marginBottom:10
  }
};

stylesheetBackgroundTransparentProfile.controlLabel = {
  normal:{
    marginHorizontal:4,
    backgroundColor:'transparent',
    color:'rgba(0,0,0,0.5)',
    fontSize:17,
    marginBottom:5
  },
  error:{
    marginHorizontal:4,
    backgroundColor:'transparent',
    fontSize:17,
    color:Color.danger,
    marginBottom:5
  }
};

stylesheetBackgroundTransparentProfile.textboxView = {
  normal:{
    borderRadius:20,
    borderColor:'#ffffff',
    marginHorizontal:4,
    backgroundColor:'#BABABA',
    flexDirection: 'row',
    alignItems: 'center',
  },
  error:{
    borderRadius:20,
    borderColor:'#ffffff',
    marginHorizontal:4,
    backgroundColor:'#BABABA',
    flexDirection: 'row',
    alignItems: 'center',
  }
};

stylesheetBackgroundTransparentProfile.dateValue = {
  normal:{
    color:'rgba(0,0,0,0.8)',
    fontSize: 18,
    paddingHorizontal: 7,
    paddingVertical: 8, 
    backgroundColor:'#BABABA',
    flexDirection: 'row',
    alignItems: 'center',
  },
  error:{
    color:'rgba(0,0,0,0.8)',
    paddingHorizontal: 7,
    paddingVertical: 8, 
    backgroundColor:'#BABABA',
    flexDirection: 'row',
    alignItems: 'center',
  }
};

const stylesheetBackgroundTransparent = _.cloneDeep(t.form.Form.stylesheet);

stylesheetBackgroundTransparent.textbox = {
  normal: {
    backgroundColor:'transparent',
    paddingHorizontal: 7,
    paddingVertical: 8, 
    color:'rgba(255,255,255,0.8)',
    flex:1,
    fontSize: 14,
  },
  error: {
    backgroundColor:'transparent',
    paddingHorizontal: 7,
    paddingVertical: 8, 
    color:'rgba(255,255,255,0.8)',
    flex:1,
    fontSize: 14,
  },
}

stylesheetBackgroundTransparent.formGroup = {
  normal:{
    flex:1,
    marginBottom:10
  },
  error:{
    flex:1,
    marginBottom:10
  }
};
stylesheetBackgroundTransparent.textboxView = {
  normal:{
    marginHorizontal:4,
    backgroundColor:'rgba(0,0,0,0.5)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  error:{
    marginHorizontal:4,
    backgroundColor:'rgba(0,0,0,0.5)',
    flexDirection: 'row',
    alignItems: 'center',
  }
};

stylesheetBackgroundTransparent.controlLabel = {
  normal:{
    marginHorizontal:4,
    backgroundColor:'transparent',
    color:'rgba(255,255,255,0.6)',
    marginBottom:5
  },
  error:{
    marginHorizontal:4,
    backgroundColor:'transparent',
    color:Color.danger,
    marginBottom:5
  }
};

stylesheetBackgroundTransparent.textboxView = {
  normal:{
    borderRadius:20,
    borderColor:'#ffffff',
    marginHorizontal:4,
    backgroundColor:'rgba(0,0,0,0.5)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  error:{
    borderRadius:20,
    borderColor:'#ffffff',
    marginHorizontal:4,
    backgroundColor:'rgba(0,0,0,0.5)',
    flexDirection: 'row',
    alignItems: 'center',
  }
};

stylesheetBackgroundTransparent.dateValue = {
  normal:{
    color:'rgba(255,255,255,0.8)',
    paddingHorizontal: 7,
    paddingVertical: 8, 
    backgroundColor:'rgba(0,0,0,0.5)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  error:{
    color:'rgba(255,255,255,0.8)',
    paddingHorizontal: 7,
    paddingVertical: 8, 
    backgroundColor:'rgba(0,0,0,0.5)',
    flexDirection: 'row',
    alignItems: 'center',
  }
};

const stylesheetTextBoxInputNPS = _.cloneDeep(t.form.Form.stylesheet);

stylesheetTextBoxInputNPS.textbox = {
  normal: {
    backgroundColor:'#F2F2F0',
    color:'#3c3c3c',
    fontSize: 18,
    width: 300,
    height : 150,
  },
  error: {
    backgroundColor:'#F2F2F0',
    color:'#3c3c3c',
    fontSize: 18,
    width: 300,
    height : 150,
  },
}

stylesheetTextBoxInputNPS.formGroup = {
  normal:{
    flex:1,
    marginBottom:10
  },
  error:{
    flex:1,
    marginBottom:10
  }
};
stylesheetTextBoxInputNPS.controlLabel = {
  normal:{
    marginHorizontal:4,
    backgroundColor:'transparent',
    color:'#3c3c3c',
    marginBottom:5
  },
  error:{
    marginHorizontal:4,
    backgroundColor:'transparent',
    color:Color.danger,
    marginBottom:5
  }
};

stylesheetTextBoxInputNPS.textboxView = {
  normal:{
    flexDirection: 'row',
    
  },
  error:{
    flexDirection: 'row',
   
  }
};

const stylesheetRow = _.cloneDeep(t.form.Form.stylesheet);
stylesheetRow.fieldset = {
  flexDirection: 'row'
};
stylesheetRow.formGroup.normal.flex = 1;
stylesheetRow.formGroup.error.flex = 1;
stylesheetRow.controlLabel.normal = stylesheetBackgroundTransparent.controlLabel.normal
stylesheetRow.textbox.normal = stylesheetBackgroundTransparent.textbox.normal

export const formInput                             = stylesheet
export const formInputBackgroundTransparent        = stylesheetBackgroundTransparent
export const formInputBackgroundTransparentProfile = stylesheetBackgroundTransparentProfile
export const formInputBackgroundTransparentBot     = stylesheetBackgroundTransparentBot
export const textBoxInputNPS                       = stylesheetTextBoxInputNPS
export const formInputAllSize                      = stylesheetAllSize
export const formInputRow                          = stylesheetRow
export const formInputUnderline                    = stylesheetUnderline
export const styles =  StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:Color.clouds
  },
  toast:{
    padding: 5,
    borderRadius: 25
  }
});


const line = _.cloneDeep(t.form.Form.stylesheet);
  line.errorBlock = {
    position:'absolute',
    bottom:0,
    fontSize: 12,
    color:Color.danger
  }
  line.formGroup = {
    normal: {
      marginTop: 10,
    },
    error: {
      marginTop: 10,
    }
  }
  line.textbox = {
    normal: {
      borderWidth:0,
      flex:1,
      fontSize:16,
      color:Color.dark,
    },
    error: {
      borderWidth:0,
      flex:1,
      fontSize:16,
      color:Color.danger,
    }
  }
  line.textboxView = {
    normal: {
      borderWidth:0,
      borderBottomWidth:1,
      borderBottomColor: Color.white,
      borderRadius:10,
      paddingBottom: Platform.OS=='ios'? 10:0,
      paddingTop: Platform.OS=='ios'? 10:0,
      paddingLeft: 10,
      paddingRight:10
    },
    error:{
      borderWidth:0,
      borderBottomWidth:1,
      borderBottomColor: Color.danger,
      borderRadius:0,
      paddingBottom: Platform.OS=='ios'? 10:0,
      paddingTop: Platform.OS=='ios'? 10:0,
      paddingLeft: 10,
      paddingRight:10
    },
  }
  line.controlLabel = {
    normal: {
      fontSize: 17,
      paddingBottom: Platform.OS=='ios'? 10:0,
      paddingTop: Platform.OS=='ios'? 10:0,
      paddingLeft: 10,
      paddingRight:10
    },
    error: {
      color:Color.danger,
      fontSize:17,
    }
  }


  

const styleBuilder = (color,styleCase)=>{
  const style = _.cloneDeep(line);
  style.controlLabel.normal.color = color
  style.textbox.normal.color = color
  switch (styleCase) {
    case 'border':
    style.textboxView.normal.borderWidth = 1
    style.textboxView.error.borderWidth = 1
    style.textboxView.normal.borderColor = color
      break;
    case 'borderRadius':
    style.textboxView.normal.borderRadius = 20
    style.textboxView.error.borderRadius = 20
    style.textboxView.normal.borderWidth = 1
    style.textboxView.error.borderWidth = 1
    style.textboxView.normal.borderColor = color
    style.textboxView.error.borderColor = Color.danger
    style.textboxView.normal.borderBottomColor = color
    style.textboxView.error.borderBottomColor = Color.danger
    style.textboxView.normal.height = moderateScale(40)
    style.textboxView.error.height = moderateScale(40)
      break;
    case 'underline':
    style.textboxView.normal.borderBottomColor = color
    break;
    case 'underlineNoPadding':
    style.textboxView.normal.borderBottomColor = color
    style.textboxView.normal.paddingLeft = 0
    style.textboxView.normal.marginLeft = 0
    style.textboxView.normal.paddingRight = 0
    style.textboxView.error.paddingLeft = 0
    style.textboxView.error.paddingRight = 0
      break;
    case 'transparent':
    style.textboxView.normal.borderBottomColor = 'transparent'
    style.textboxView.normal.borderColor = 'transparent'
      break;
    default:
    style.textboxView.normal.borderWidth = 1
    style.textboxView.error.borderWidth = 1
    style.textboxView.normal.borderColor = color
    break;
  }
  return style
}
//bordered,underline,transparent,backgroundColor
export const formStyle = {
  underline:{
    dark:styleBuilder(Color.dark,'underline'),
    white:styleBuilder(Color.white,'underline'),
  },
  underlineNoPadding:{
    dark:styleBuilder(Color.dark,'underlineNoPadding'),
    white:styleBuilder(Color.white,'underlineNoPadding'),
    transparent:styleBuilder(Color.transparent,'underlineNoPadding'),
  },
  border:{
    dark:styleBuilder(Color.dark,'border'),
    white:styleBuilder(Color.white,'border'),
  },
  borderRadius:{
    dark:styleBuilder(Color.dark,'borderRadius'),
    asbestos:styleBuilder(Color.asbestos,'borderRadius'),
    white:styleBuilder(Color.white,'borderRadius'),
  },
  transparent:{
    dark:styleBuilder(Color.dark,'transparent'),
    white:styleBuilder(Color.white,'transparent'),
  },
}