class MCartAddons extends HTMLElement{constructor(){super(),this.selectors={zipCode:'[name="address[zip]"]',province:'[name="address[province]"]',country:'[name="address[country]"]',addressForm:'[data-address="root"]',shippingMessage:".m-cart-addon__shipping-rate",cartDiscountCode:'[name="discount"]',cartDiscountCodeNoti:"[data-discount-noti]",cartNote:'[name="note"]',saveAddonButton:".m-cart-addon--save",closeAddonButton:".m-cart-addon--close",calcShippingButton:".m-cart-addon--calculate",triggerAddonButton:".m-cart-addon--trigger-button",devliveryTime:'[name="attributes[Delivery time]"]'},this.cartWrapper=document.querySelector(".m-cart-drawer"),this.isCartPage="cart"===ElegantSettings.templateName,this.isCartPage&&(this.cartWrapper=document.querySelector(".m-cart__footer--wrapper")),this.initAddress=!1,this.cartOverlay=this.cartWrapper.querySelector(".m-cart__overlay"),this.domNodes=queryDomNodes(this.selectors,this),this.rootUrl=window.Shopify.routes.root,this.discountCodeKey="elegant-discount-code",this.deliveryCodeKey="elegant-delivery-code",this.init()}init(){const{cartDiscountCode:e,cartDiscountCodeNoti:t,devliveryTime:s}=this.domNodes;if(addEventDelegate({selector:this.selectors.triggerAddonButton,context:this,handler:(e,t)=>{if(e.preventDefault(),this.isCartPage){const e=document.querySelector(".m-cart-addon__body.open");e&&e.classList.remove("open")}const{open:s}=t.dataset,o=this.cartWrapper.querySelector(`#m-addons-${s}`);this.removeActiveAllButton(),t.classList.add("active"),o&&o.classList.add("open"),this.cartOverlay&&this.cartOverlay.classList.add("open"),this.openAddon=o,"shipping"===s&&fetchSection("country-options",{url:window.ElegantSettings.base_url}).then((e=>{const t=e.querySelector("#AddressCountry"),s=t&&t.querySelectorAll("option"),i=o.querySelector("#MadrressCountry select");s&&s.forEach((e=>{i&&i.appendChild(e)})),this.setupCountries(),i.value=i&&i.dataset.default})).catch(console.error)}}),addEventDelegate({selector:this.selectors.closeAddonButton,context:this.cartWrapper,handler:this.close.bind(this)}),addEventDelegate({selector:this.selectors.calcShippingButton,context:this.cartWrapper,handler:this.calcShipping.bind(this)}),e){const s=localStorage.getItem(this.discountCodeKey);s&&(e.value=s,t&&(t.style.display="inline"))}if(s){const e=localStorage.getItem(this.deliveryCodeKey);e&&(s.value=e)}this.saveAddonValue();const o=(new Date).toISOString().slice(0,16),i=this.querySelector("#delivery-time");i&&(i.min=o)}removeActiveAllButton(){const e=this.querySelectorAll(this.selectors.triggerAddonButton);e&&e.forEach((e=>e.classList.remove("active")))}setupCountries(){this.initAddress||Shopify&&Shopify.CountryProvinceSelector&&(new Shopify.CountryProvinceSelector("AddressCountry","AddressProvince",{hideElement:"AddressProvinceContainer"}),this.initAddress=!0)}close(e){e.preventDefault(),this.openAddon.classList.remove("open"),this.cartOverlay&&this.cartOverlay.classList.remove("open"),this.removeActiveAllButton(),this.openAddon=null}calcShipping(e){e.preventDefault();const t=e.target.closest(".m-cart-addon__action");t.classList.add("m-spinner-loading");const s=this.domNodes.zipCode&&this.domNodes.zipCode.value&&this.domNodes.zipCode.value.trim(),o=this.domNodes.country.value,i=this.domNodes.province.value;this.domNodes.shippingMessage.classList.remove("error"),this.domNodes.shippingMessage.innerHTML="";const n="true"===t.dataset.showDeliveryDays;fetch(`${this.rootUrl}cart/shipping_rates.json?shipping_address%5Bzip%5D=${s}&shipping_address%5Bcountry%5D=${o}&shipping_address%5Bprovince%5D=${i}`).then((e=>e.json())).then((e=>{if(e&&e.shipping_rates){const{shipping_rates:s}=e,{shippingRatesResult:o,noShippingRate:i}=ElegantStrings;if(s.length>0){t.classList.remove("m-spinner-loading");const e=document.createElement("P");e.classList.add("m-cart-addon__shipping-rate--label"),e.innerHTML=`${o.replace("{{count}}",s.length)}:`,this.domNodes.shippingMessage.appendChild(e),s.map((e=>{const{deliveryOne:s="Day",deliveryOther:o="Days"}=t.dataset;let i="";if(e.delivery_days.length>0&&n){let t=s;const n=e.delivery_days[0],r=e.delivery_days.at(-1);n>1&&(t=o),i=n===r?`(${n} ${t})`:`(${n} - ${r} ${t})`}const r=document.createElement("P");r.classList.add("m-cart-addon__shipping-rate--item"),r.innerHTML=`${e.name}: <span>${e.price} ${Shopify.currency.active}</span> ${i}`,this.domNodes.shippingMessage.appendChild(r)}))}else t.classList.remove("m-spinner-loading"),this.domNodes.shippingMessage.innerHTML=`<p>${i}</p>`}else t.classList.remove("m-spinner-loading"),Object.entries(e).map((e=>{this.domNodes.shippingMessage.classList.add(e[0]&&e[0].toLowerCase());const t=`${e[1][0]}`,s=document.createElement("P");s.classList.add("m-cart-addon__shipping-rate--error"),s.innerHTML=`${t}<sup>*</sup>`,this.domNodes.shippingMessage.appendChild(s)}))})).catch(console.error)}saveAddonValue(){addEventDelegate({event:"click",context:this.cartWrapper,selector:this.selectors.saveAddonButton,handler:(e,t)=>{e.preventDefault();const{cartDiscountCode:s,cartDiscountCodeNoti:o,devliveryTime:i}=this.domNodes;if("coupon"===t.dataset.action&&s){const t=s.value;localStorage.setItem(this.discountCodeKey,t),o.style.display=""!==t&&o?"inline":"none",this.close(e)}if("note"===t.dataset.action&&(this.updateCartNote(),this.close(e)),"delivery"===t.dataset.action){const t=i.value;Date.parse(t)>Date.now()?(localStorage.setItem(this.deliveryCodeKey,t),this.close(e)):(localStorage.setItem(this.deliveryCodeKey,""),i.value="",window.ElegantTheme.Notification.show({target:this.querySelector(".m-cart-addon-message-error"),method:"appendChild",type:"error",message:window.ElegantStrings.valideDateTimeDelivery,last:3e3,sticky:!1}))}}})}updateCartNote(){const e=this.domNodes.cartNote.value,t=JSON.stringify({note:e});fetch(`${window.ElegantSettings.routes.cart_update_url}`,{...fetchConfig(),body:t})}}customElements.define("m-cart-addons",MCartAddons);