const production = true
const voice = production ? 'https://bcc.bni.sdtech.co.id/api/' : 'https://bcc.bni.sdtech.co.id/api/';
const hajiPintar = production ? 'https://dev.lenna.id/' : 'https://dev.lenna.id/';
export default {
//LOGIN, LOGOUT, REGISTER
login:hajiPintar+'haji/api/auth/login',
loginV2:hajiPintar+'auth/login_post_v2',
setPhonePass:hajiPintar + 'user/createpasswordandphone',
logout:hajiPintar+'auth/logout',
register:hajiPintar+'haji/api/register',

//MAIN CHAT
mainChat:hajiPintar+'service/exec',
  
//ORDER
order : hajiPintar+'order/',  //{id}/history  // verb : GET

//GET USER DATA
getProfile : hajiPintar+'user/',//{id}/profile
getAccounts : hajiPintar+ 'bni/account/debit?',
getStatus : hajiPintar +'bni/auth/status?',
feedbackNPS : hajiPintar + 'feedback/savenps',
checkAppVersion : hajiPintar + 'general/getversioncodeios',

//GET DATA
getDoa : hajiPintar + 'haji/admin/article/all_post',
getDetailDoa : hajiPintar + 'haji/admin/article/api_viewarticle',
nomorPorsi: hajiPintar + 'haji/api/apikemenag/api_no_porsi',
nomorPaspor: hajiPintar + 'haji/api/apikemenag/api_no_paspor',
jadwalKeberangkatan: hajiPintar + 'haji/api/apikemenag/api_jadwal_berangkat',

//GET MENU
menuJamaah: hajiPintar + 'haji/admin/apimenu/jamaah',
menuPetugas: hajiPintar + 'haji/admin/apimenu/petugas',
menuTPIHI: hajiPintar + 'haji/admin/apimenu/tpihi',

//MENU
menuJamaah : hajiPintar + 'haji/admin/apimenu/jamaah',
menuTPHI : hajiPintar + 'haji/admin/apimenu/petugas',

//TPHI
laporanKeberangkatanDanKedatangan:hajiPintar + 'haji/api/apikemenag/save_perjalanan',

//TPIHI MAKKAH
bimbinganMakkah: hajiPintar + 'haji/api/apikemenag/save_bimbingan_makkah',

//TPIHI MADINAH
bimbinganMadinah: hajiPintar + 'haji/api/apikemenag/save_bimbingan_madinah',


//UPDATE USER DATA
updateBotGender:hajiPintar+'user/',
updateProfile : hajiPintar+'user/',//{id}/profile'
changePassword:hajiPintar+'user/changepassword', 
forgotPassword: hajiPintar+'forgotpassword',
changeDevice: hajiPintar+'bni/auth/device-reset',
createAndUpdateTransPass:hajiPintar+'bni/auth/password',

//OTP AND EMAIL SEND
resendOtpActivatePin:hajiPintar+'bni/auth/resend-otp',
resendOTP:hajiPintar+'cms/resendverifotp',
resendEmail:hajiPintar+'cms/resendverifotpemail',
verifEmail:hajiPintar+'cms/resendverifemail',
checkOTP:hajiPintar+'cms/checkotp',


//OTHERS
faq:hajiPintar+'cms/getFaq',
termsAndCondition:hajiPintar+'cms/gettermsandconditions',
wordReplace:hajiPintar+'wordreplace/getdata/ios',
getVoice:voice+'general/getvoiceurl',

feedback : hajiPintar+ 'feedback/save',
balance : hajiPintar+'wallet/',  //{id}/balance  // verb : GET
history : hajiPintar+'wallet/',  //{id}/history  // verb : GET
voucher:hajiPintar+'voucher/redeem',
voucherCheck:hajiPintar+'voucher/check',


//HAJI
jadwalSholat : hajiPintar + 'haji/admin/shalat/waktushalat'

// dateReplace:devLenna+'wordreplace/getdata/ios',
// createTransDummy : hajiPintar+'bni/auth/decrypt',
}