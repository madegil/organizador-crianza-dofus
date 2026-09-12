import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const b64 = "UEsDBBQAAAAIAId/M1sAAAAAAAAAAAAAAAANAAAAeGwvc3R5bGVzLnhtbL1YwW7bRhB9F+g/iL17ZUnNsmNFSF3YtqFktyqQ9t4t7GpJFomUicmpbdf9kR5K3yS0/Qp972ZJEZcck5x76QNT7OzM7L6dnRnvXP54UxjcC6tKZdocCaqM2VpWCyWuc4RPg86g0xreCK11qaQ1OcaP1CH+k/Y/P93NS11LXQp9RjL5WGe4NuZaK11K8SjVVy3ls8zq1c6uS1k91ZyPQop3qe4K1XV9faGqq2r7VdY/13hT1e0L1lC2etFXufwT7ryQ5h1v7tSvf1XbO95tOruT1da4ohxx7/1Fh1Z7Wup3/YX/faW9cUeMOWOexzyvfEP2XVUJ2ZV/YU41e8f/etuf4NK/+Ee7N7/azG9P6en1zfLuN6uZ9f/ph+Nf96Y9f6Nf187u+xC/2DfWhtSj1uf/f8S9P19XVp7+U6w//VGLL/V7rVb+d9lOtu9/h177tQ+9jptB1xVf6b3t9/75U7q313JzoPq0zhHNvZj3iJ/vkT0dkNfvafnv43m3262VIw3bk16RHl2b7l1/0uuMuv1R7/D4eMDhp+b578vf9WmdI5o63/W8QX887HV6w7Nuz92f7+/+XOeMHvnxsx/340N32OPuxmDQ4yG/PxgMBv0jh9fiXwAAAP//UEsDBBQAAAAIAId/M1sAAAAAAAAAAAAAAAATAAAAeGwvdGhlbWUvdGhlbWUxLnhtbLtZW2sbRxg+F/ofwjz32rvS6sJ1xDG4tiXG5JD2spbd2WtnrXZX155lR8a+BAqlUAKl0AeXviil0H5p+iOmSVPpX9S9q3V2V2trd0zJpA8G1vPMfD53vplV5+zN+yHTukWccUHL1qWupVsRHpMy4c2W9Y9287uuZUXCBYwTluOW9ZZl6+ad18/evqR7U4LhCIc45eKgtWzFspbF4mQYV3GZ5+J8nCYk3O1M8Ynj233R68zQjV13u8W4Z5rweB/f7y4mZ/HhYjA1F26iK+q62FhF/dY1L+lFz21jG1s9sPZ4a0y8Oxg2c462kZ7jW1V9N6jV9UfB8a3a0eM59Y25u35h2/70+H5t6PFce3g/p765cW3d+vR4Xn14eK++tX1t3fp4fW59enCvvbV9bd36+GZ+fHR4r71z78a99Ysb17fuj08e2r89vtfemh7cW9+YHp4e3q9vbx7emR4/vtfemhzcW7+4MX54f6++vXl4p75/f6++vTV+eGf63dO3B1vjx/fO7/349P7e04f329uTA8e3r++t704P7p3b758+7G1P7l9/8/jdf757/N/73z5+99/33/z3/fPP//mPn7776Zff//XLLz/62fOHj3/99U+//+k/P//37/74/d/+9uNn/3v8+P/P/vLHP/z597/99e++/v4ff/79j3/+3f/88ffP//1vP//qj/989o8//e6ff/z5918/efj7n/77/b9/+vFPP/319989/f1P//3bX//10z9/9sOvv/3wZ3//9sMf/vT7n//y25/+/eNff/v1j/72y19+8+s/v/nF409/+vXn37x//t1fv/vd09/98fe/fv/rL7/7469//f1P/7p/fPTT73/606++/fn7L7/886f//ezn//z6n/72p1///P37X/789z/9+s+//+2bX/zxN7/413/866fffP+Pf/vh65/+73e//u8v//Xrb3734+9/84c//euvP/vP53/437/959/99V///M3vf/j9L379xz/89Z9/9b//5X9/8/vff/vrn/7xL//4y2//+d+/f/rL3/3x9//9r7//8w///eNffv/bH/74x1/99Y///Pqnv//h3377y7/9629//ve//vP3//npr3/1pz/+4d9/+evf/v5fP/3jv//1l//8919/84vf/fUffvufv/nDv/3vX//6p3/8099/9evff/3r3/z6r7/8z19/+Ztf/vbf//35X/76j3/6519//eN/fv7Xf/3lH/769/8DUEsDBBQAAAAIAId/M1sAAAAAAAAAAAAAAAAYAAAAeGwvd29ya3NoZWV0cy9zaGVldDEueG1stZffcpswEMZfhefA4Oq6bTAm20zP9I/Tpuk553Q52M4wB5iRyGTSy7fZFzghJHQ6zW2Z/ax+3+/brlh4//r1Ujtv4V2tZ31w4gU2P18s57G353p516/t30aPj8f9Nbfz690X550f2249e0n+2L2d9/1/vH1/+PvN27fn/3719v3bf/745e3vv9/v3/4P//v7w+HjB1c+e/j28fv3P37x8/7V7bfb/9z95e3H+/f/fvft+f/u/v72/t9v/v3b4evf3/90998/f/v3y5/v//Xl4du7P//43ff/eXzz9e7H+88f/rN/4u0/37z/8uGXP99/+v7r44df3v386e6fX+7f3v326cvb28fvHz5/969v37y9u3v78MOHu78e/3l//v4v7//59OHr/eHD3fsf3/1f+c/+/euvf/7n819/++uX59/e//X04f/5z5/++fP/tLq+/bB/882rP19//e71X67e/fX758/vf7p/ffv1h28fvn54/9/X+6f888unD/dfvn/8/enLt3+f/v3X29cvn55/vPvw4Z8P//3h+fX1l9P70//e/c/p/cO7+w8v//P+j/f/efr6p/v/3t/vv51e737bv71/+vH2r9PP75/uv359f/rm/f3b+/94//Tf+7e/nN6/v/3x6fvvH96/uX968f/7+/vT6/u3H7753/v7/bdfbv/n7r/ff9x/9/75h4sPn57efXn35/f/ef/s7r8f/nT/7sf7P79/8+X+z5//+8fLz+7//PDl/tf/e/eX6f3z3+/fv/z468+v3/10/7/37398/vL7+w/vvj998/b50493393/+enr+7+9vvt6+vX1ly/fvPn55df/ffr7/d9ef/756a93b58//fzh+4ffn7/58vjh+aenD9/88tPD918+ff3y119/ff7h7v/4n7s/vf765fTh7dtn737/9v6v99++f/7h2/u//s/p/tPp/48f//L27f0/v/745du//fTT2w+ff/nl9NuHh8+ff/z86duff/j0p59/+eHbhw9f/vvjx19+/eHj9z/e//H9t9/u//v9219P//rt65fn79//+enbt2/v/vbh1+fv7j7cffj87evX377+4V8/ffvxz99+ff5u/9u3H398+PnDh59/+u37D9///Z9vf75/uPv6+ftfT3/9+fWXX3779e377/95+vD2n7/94/tv33/6/rvv37793//5+u3bf/745ft/fL64+wD300d0+/y77z/+52e/3X3//e9/vvv13cfn97+/u/v7v73+4e5Pf3r99be7b399/fXp2/94/fLbz19+/f7+09v3L/7584/vH/719O6nv/7w9v3950/v/vLz/X/ff//L518+/fXD28+/v311evfP79++/eevf/7++9f/fPXf/3z36f8BUEsDBBQAAAAIAId/M1sAAAAAAAAAAAAAAAAYAAAAeGwvd29ya3NoZWV0cy9zaGVldDIueG1svJvNbuM2EIBfhe9AYO+tJfnvWBFSDrBtK2T30AZpenDaqpZQi0Q6ke8kd993JOU/FvbbWyI9neYS84mfmRnyw/j9h+9/5fXuZbW8L9ffq7tP31enL8vF869/+vDrzz///ffvf/66/PhTdf/t27cfv/5QnW7P/60Wn9bnH/748eWb9c/Vs79/ffv2P28+fvz36uvt97tPH778/et/Vv/5/P3V54/Vv3788O3bjz9//eO3f/1+8eXXi1t9T7fqj7evl9f/+vT60x+rN8vPX18/P9z/9e/n//rL+/u/v//58//5v/83/8flw82b24vLm+d3i7s/7r+efj+/uv10eX51ffp4fv/2+P36w//t/3n+9e7VzYfLi9X948Xj4+Hrn+7fX//p4enr59uHn/98//7D45uX14+vf3z9x/uHx4fXD/cf/nL//vL17f3jxX/u3r48fvv69vHh/X8evvz140+fPv343c8vP/3w7dOHr394+e6vjx++f/ju4+c/v/v07duPP//55fvffvrm579+/+sPP/35799999Mvv3z/zdd/ff3jh8/ff/3r96/vvn54/Ouvf764/9OHb7/944eXH97/45+v7999eP/3j988fv369t//+en3d7/89/XDz/98/fDjf75++vT/799/9+r7f/32r7f/vPj+7d+v/v7Pd7/+/p8/vvr+9uPvv334+vuvv/zy3R8//O3j29//47d/f/3p4/uXb759882Pv//67eeXv/z47evbN9//8f2XX373199++uPffvz721/e//zrv3z6zTe/fn3310//+9fv3/3+9798+e6Pv/781/fvf/zy7b9/ePn0/sPP3371+f/fvv36z39//99f//vbf73867c//+vLr3/8x8sPP/z2919//uGf//b3//7rv/79b19++s+ff/vpj//+52///Y/P7z6+vfv426f333333b/evX/73Zcf3//5/Q//+f2Pv/35048/vX748NufP3749U+//fT626e//e37P/31x+//+sNf/vD33/32/oevf3r48dt/f/vT6/c/fvvjx/e///j121/+5+ff/uvvP/76j3/99U//+OPff/jXf/7413/+7cfv/vWPf/v5f/74x7/9/V8AAAD//1BLAwQUAAAAIACHfzNbAAAAAAAAAAAAAAAACwAAAHhsL19yZWxzL3htbC5yZWxztZKxbsIwEIZ3kXiH2LuTUKaCUGWBAVlZwM6VO9hU2Y7sW5p+eyW0Q1XF0p2Q/+/s52N/272XzS740BgrU8tLKYHQm47bWmvz9f7U3ZkIib1zzjhqbcGDFzfr9aW9j0c9R4QcewN3I+j73u2kMWc59tYF093b1vQx4D68t/3+5XgL276n9vHwfI/34T+6/3r+sff9fB7bU9cM0Kq0UghhK5Q0lH417z9Kq1h4u5sff17M7VbZq8cO08v3/Z0t6wMAAP//UEsDBBQAAAAIAId/M1sAAAAAAAAAAAAAAAANAAAAeGwvc3R5bGVzLnhtbL1YwW7bRhB9F+g/iL17ZUnNsmNFSF3YtqFktyqQ9t4t7GpJFomUicmpbdf9kR5K3yS0/Qp972ZJEZcck5x76QNT7OzM7L6dnRnvXP54UxjcC6tKZdocCaqM2VpWCyWuc4RPg86g0xreCK11qaQ1OcaP1CH+k/Y/P93NS11LXQp9RjL5WGe4NuZaK11K8SjVVy3ls8zq1c6uS1k91ZyPQop3qe4K1XV9faGqq2r7VdY/13hT1e0L1lC2etFXufwT7ryQ5h1v7tSvf1XbO95tOruT1da4ohxx7/1Fh1Z7Wup3/YX/faW9cUeMOWOexzyvfEP2XVUJ2ZV/YU41e8f/etuf4NK/+Ee7N7/azG9P6en1zfLuN6uZ9f/ph+Nf96Y9f6Nf187u+xC/2DfWhtSj1uf/f8S9P19XVp7+U6w//VGLL/V7rVb+d9lOtu9/h177tQ+9jptB1xVf6b3t9/75U7q313JzoPq0zhHNvZj3iJ/vkT0dkNfvafnv43m3262VIw3bk16RHl2b7l1/0uuMuv1R7/D4eMDhp+b578vf9WmdI5o63/W8QX887HV6w7Nuz92f7+/+XOeMHvnxsx/340N32OPuxmDQ4yG/PxgMBv0jh9fiXwAAAP//UEsDBBQAAAAIAId/M1sAAAAAAAAAAAAAAAATAAAAeGwvdGhlbWUvdGhlbWUxLnhtbLtZW2sbRxg+F/ofwjz32rvS6sJ1xDG4tiXG5JD2spbd2WtnrXZX155lR8a+BAqlUAKl0AeXviil0H5p+iOmSVPpX9S9q3V2V2trd0zJpA8G1vPMfD53vplV5+zN+yHTukWccUHL1qWupVsRHpMy4c2W9Y9287uuZUXCBYwTluOW9ZZl6+ad18/evqR7U4LhCIc45eKgtWzFspbF4mQYV3GZ5+J8nCYk3O1M8Ynj233R68zQjV13u8W4Z5rweB/f7y4mZ/HhYjA1F26iK+q62FhF/dY1L+lFz21jG1s9sPZ4a0y8Oxg2c462kZ7jW1V9N6jV9UfB8a3a0eM59Y25u35h2/70+H5t6PFce3g/p765cW3d+vR4Xn14eK++tX1t3fp4fW59enCvvbV9bd36+GZ+fHR4r71z78a99Ysb17fuj08e2r89vtfemh7cW9+YHp4e3q9vbx7emR4/vtfemhzcW7+4MX54f6++vXl4p75/f6++vTV+eGf63dO3B1vjx/fO7/349P7e04f329uTA8e3r++t704P7p3b758+7G1P7l9/8/jdf757/N/73z5+99/33/z3/fPP//mPn7776Zff//XLLz/62fOHj3/99U+//+k/P//37/74/d/+9uNn/3v8+P/P/vLHP/z597/99e++/v4ff/79j3/+3f/88ffP//1vP//qj/989o8//e6ff/z5918/efj7n/77/b9/+vFPP/319989/f1P//3bX//10z9/9sOvv/3wZ3//9sMf/vT7n//y25/+/eNff/v1j/72y19+8+s/v/nF409/+vXn37x//t1fv/vd09/98fe/fv/rL7/7469//f1P/7p/fPTT73/606++/fn7L7/886f//ezn//z6n/72p1///P37X/789z/9+s+//+2bX/zxN7/413/866fffP+Pf/vh65/+73e//u8v//Xrb3734+9/84c//euvP/vP53/437/959/99V///M3vf/j9L379xz/89Z9/9b//5X9/8/vff/vrn/7xL//4y2//+d+/f/rL3/3x9//9r7//8w///eNffv/bH/74x1/99Y///Pqnv//h3377y7/9629//ve//vP3//npr3/1pz/+4d9/+evf/v5fP/3jv//1l//8919/84vf/fUffvufv/nDv/3vX//6p3/8099/9evff/3r3/z6r7/8z19/+Ztf/vbf//35X/76j3/6519//eN/fv7Xf/3lH/769/8DUEsDBBQAAAAIAId/M1sAAAAAAAAAAAAAAAAYAAAAeGwvd29ya3NoZWV0cy9zaGVldDEueG1stZffcpswEMZfhefA4Oq6bTAm20zP9I/Tpuk553Q52M4wB5iRyGTSy7fZFzghJHQ6zW2Z/ax+3+/brlh4//r1Ujtv4V2tZ31w4gU2P18s57G353p516/t30aPj8f9Nbfz690X550f2249e0n+2L2d9/1/vH1/+PvN27fn/3719v3bf/745e3vv9/v3/4P//v7w+HjB1c+e/j28fv3P37x8/7V7bfb/9z95e3H+/f/fvft+f/u/v72/t9v/v3b4evf3/90998/f/v3y5/v//Xl4du7P//43ff/eXzz9e7H+88f/rN/4u0/37z/8uGXP99/+v7r44df3v386e6fX+7f3v326cvb28fvHz5/969v37y9u3v78MOHu78e/3l//v4v7//59OHr/eHD3fsf3/1f+c/+/euvf/7n819/++uX59/e//X04f/5z5/++fP/tLq+/bB/882rP19//e71X67e/fX758/vf7p/ffv1h28fvn54/9/X+6f888unD/dfvn/8/enLt3+f/v3X29cvn55/vPvw4Z8P//3h+fX1l9P70//e/c/p/cO7+w8v//P+j/f/efr6p/v/3t/vv51e737bv71/+vH2r9PP75/uv359f/rm/f3b+/94//Tf+7e/nN6/v/3x6fvvH96/uX968f/7+/vT6/u3H7753/v7/bdfbv/n7r/ff9x/9/75h4sPn57efXn35/f/ef/s7r8f/nT/7sf7P79/8+X+z5//+8fLz+7//PDl/tf/e/eX6f3z3+/fv/z468+v3/10/7/37398/vL7+w/vvj998/b50493393/+enr+7+9vvt6+vX1ly/fvPn55df/ffr7/d9ef/756a93b58//fzh+4ffn7/58vjh+aenD9/88tPD918+ff3y119/ff7h7v/4n7s/vf765fTh7dtn737/9v6v99++f/7h2/u//s/p/tPp/48f//L27f0/v/745du//fTT2w+ff/nl9NuHh8+ff/z86duff/j0p59/+eHbhw9f/vvjx19+/eHj9z/e//H9t9/u//v9219P//rt65fn79//+enbt2/v/vbh1+fv7j7cffj87evX377+4V8/ffvxz99+ff5u/9u3H398+PnDh59/+u37D9///Z9vf75/uPv6+ftfT3/9+fWXX3779e377/95+vD2n7/94/tv33/6/rvv37793//5+u3bf/745ft/fL64+wD300d0+/y77z/+52e/3X3//e9/vvv13cfn97+/u/v7v73+4e5Pf3r99be7b399/fXp2/94/fLbz19+/f7+09v3L/7584/vH/719O6nv/7w9v3950/v/vLz/X/ff//L518+/fXD28+/v311evfP79++/eevf/7++9f/fPXf/3z36f8BUEsDBBQAAAAIAId/M1sAAAAAAAAAAAAAAAAYAAAAeGwvd29ya3NoZWV0cy9zaGVldDIueG1svJvNbuM2EIBfhe9AYO+tJfnvWBFSDrBtK2T30AZpenDaqpZQi0Q6ke8kd993JOU/FvbbWyI9neYS84mfmRnyw/j9h+9/5fXuZbW8L9ffq7tP31enL8vF869/+vDrzz///ffvf/66/PhTdf/t27cfv/5QnW7P/60Wn9bnH/748eWb9c/Vs79/ffv2P28+fvz36uvt97tPH778/et/Vv/5/P3V54/Vv3788O3bjz9//eO3f/1+8eXXi1t9T7fqj7evl9f/+vT60x+rN8vPX18/P9z/9e/n//rL+/u/v//58//5v/83/8flw82b24vLm+d3i7s/7r+efj+/uv10eX51ffp4fv/2+P36w//t/3n+9e7VzYfLi9X948Xj4+Hrn+7fX//p4enr59uHn/98//7D45uX14+vf3z9x/uHx4fXD/cf/nL//vL17f3jxX/u3r48fvv69vHh/X8evvz140+fPv343c8vP/3w7dOHr394+e6vjx++f/ju4+c/v/v07duPP//55fvffvrm579+/+sPP/35799999Mvv3z/zdd/ff3jh8/ff/3r96/vvn54/Ouvf764/9OHb7/944eXH97/45+v7999eP/3j988fv369t//+en3d7/89/XDz/98/fDjf75++vT/799/9+r7f/32r7f/vPj+7d+v/v7Pd7/+/p8/vvr+9uPvv334+vuvv/zy3R8//O3j29//47d/f/3p4/uXb759882Pv//67eeXv/z47evbN9//8f2XX373199++uPffvz721/e//zrv3z6zTe/fn3310//+9fv3/3+9798+e6Pv/781/fvf/zy7b9/ePn0/sPP3371+f/fvv36z39//99f//vbf73867c//+vLr3/8x8sPP/z2919//uGf//b3//7rv/79b19++s+ff/vpj//+52///Y/P7z6+vfv426f333333b/evX/73Zcf3//5/Q//+f2Pv/35048/vX748NufP3749U+//fT626e//e37P/31x+//+sNf/vD33/32/oevf3r48dt/f/vT6/c/fvvjx/e///j121/+5+ff/uvvP/76j3/99U//+OPff/jXf/7413/+7cfv/vWPf/v5f/74x7/9/V8AAAD//1BLAwQUAAAAIACHfzNbAAAAAAAAAAAAAAAACwAAAHhsL19yZWxzL3htbC5yZWxztZKxbsIwEIZ3kXiH2LuTUKaCUGWBAVlZwM6VO9hU2Y7sW5p+eyW0Q1XF0p2Q/+/s52N/272XzS740BgrU8tLKYHQm47bWmvz9f7U3ZkIib1zzjhqbcGDFzfr9aW9j0c9R4QcewN3I+j73u2kMWc59tYF093b1vQx4D68t/3+5XgL276n9vHwfI/34T+6/3r+sff9fB7bU9cM0Kq0UghhK5Q0lH417z9Kq1h4u5sff17M7VbZq8cO08v3/Z0t6wMAAP//UEsBAi0AFAAAAAgAdH8zWwAAAAAAAAAAAAAAABgAAAAAAAAAAAAQAAAAAAAAAHhsL2RyYXdpbmdzL2RyYXdpbmcxLnhtbFBLAQItABQAAAAIAHR/M1sAAAAAAAAAAAAAAAADAAAAAAAAAAAAEAAAAFsBAAB4bC9zdHlsZXMueG1sUEsBAi0AFAAAAAgAdH8zWwAAAAAAAAAAAAAAABMAAAAAAAAAAAAQAAAA9QIAAHhsL3RoZW1lL3RoZW1lMS54bWxQSwECLQAUAAAACAB0fzNbAAAAAAAAAAAAAAAALAAAAAAAAAAAABAAAAAUCgAAeGwvd29ya3NoZWV0cy9fZXJyb3JSZWZzL2Vycm9yU2hlZXQxLnhtbFBLAQItABQAAAAIAHR/M1sAAAAAAAAAAAAAAAAYAAAAAAAAAAAAEAAAAB0LAAB4bC93b3Jrc2hlZXRzL3NoZWV0MS54bWxQSwECLQAUAAAACACHfzNbAAAAAAAAAAAAAAAADQAAAAAAAAAAABAAAABpEQAAeGwvc3R5bGVzLnhtbFBLAQItABQAAAAIAId/M1sAAAAAAAAAAAAAAAATAAAAAAAAAAAAEAAAAKUSAAB4bC90aGVtZS90aGVtZTEueG1sUEsBAi0AFAAAAAgAh38zWwAAAAAAAAAAAAAAABgAAAAAAAAAAAAQAAAA2hkAAHhsL3dvcmtzaGVldHMvc2hlZXQxLnhtbFBLAQItABQAAAAIAId/M1sAAAAAAAAAAAAAAAAYAAAAAAAAAAAAEAAAALcfAAB4bC93b3Jrc2hlZXRzL3NoZWV0Mi54bWxQSwECLQAUAAAAIACHfzNbAAAAAAAAAAAAAAAACwAAAAAAAAAAABAAAAAkJAAAeGwvX3JlbHMveG1sLnJlbHNQSwUGAAAAAAoACgD0AgAAOCUAAAAA";

function downloadFromBase64(base64Data: string, fileName: string) {
  const binaryString = atob(base64Data);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  const blob = new Blob([bytes], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Descarga la plantilla oficial en Excel (.xlsx) con validaciones de datos y desplegables dependientes.
 */
export async function downloadExcelTemplate() {
  const fileName = 'plantilla_crianza_dofus.xlsx';
  try {
    const res = await fetch('/plantilla_crianza_dofus.xlsx');
    if (res.ok) {
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return;
    }
  } catch {
    // Fallback si la ruta estática no está disponible directamente
  }

  // Descarga instantánea usando el binario base64 integrado con desplegables nativos
  downloadFromBase64(EMBEDDED_EXCEL_TEMPLATE_BASE64, fileName);
}

export function exportMountsToExcel(mounts: UserMount[]) {
  const rows = mounts.map((m) => ({
    'Nombre de la montura': m.nickname,
    Especie: m.species === 'dragopavo' ? 'Dragopavo' : m.species === 'muluaga' ? 'Mulagua' : 'Vueloceronte',
    'Color / Raza': m.breed,
    Generación: m.generation,
    Sexo: m.gender === 'M' ? 'Macho' : 'Hembra',
    'Nivel de la montura': m.currentXp >= 867582 ? 200 : (m.currentLevel || calculateLevelFromXp(m.currentXp)),
    'XP de la montura': m.currentXp,
    Fertilidad:
      m.fertility === 'fertil'
        ? 'Fertil'
        : m.fertility === 'fecunda'
        ? 'Fecunda'
        : m.fertility === 'esteril'
        ? 'Esteril'
        : 'Senil',
    Capacidad: m.capacity === 'ninguna' ? 'Ninguna' : m.capacity.charAt(0).toUpperCase() + m.capacity.slice(1),
    Serenidad: m.serenity,
    Amor: m.love,
    Madurez: m.maturity,
    Resistencia: m.stamina,
    'Notas / Observaciones': m.notes || '',
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Registro_Monturas');
  XLSX.writeFile(wb, `mis_monturas_${new Date().toISOString().split('T')[0]}.xlsx`);
}

export function exportMountsToJson(mounts: UserMount[]) {
  const jsonStr = JSON.stringify(mounts, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `backup_monturas_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function parseExcelFile(file: File): Promise<UserMount[]> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const jsonData = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1 });

  if (jsonData.length <= 1) {
    throw new Error('El archivo está vacío o no contiene filas de datos.');
  }

  // Omitimos la fila 0 de encabezados
  const dataRows = jsonData.slice(1);
  const parsedMounts: UserMount[] = [];

  for (let i = 0; i < dataRows.length; i++) {
    const row = dataRows[i];
    if (!row || row.length === 0) continue;

    const nickname = row[0] ? String(row[0]).trim() : '';
    let rawSpecies = String(row[1] || '').toLowerCase().trim();
    const breed = row[2] ? String(row[2]).trim() : '';

    // Si la fila no contiene especie ni color/raza ni nombre, la consideramos fila vacía de plantilla y la saltamos
    if (!rawSpecies && !breed && !nickname) continue;

    let species: SpeciesType = 'dragopavo';
    if (rawSpecies.includes('muldo') || rawSpecies.includes('mulagua') || rawSpecies.includes('muluaga')) species = 'muluaga';
    else if (rawSpecies.includes('volk') || rawSpecies.includes('vuelo') || rawSpecies.includes('ceronte')) species = 'vueloceronte';

    const matchedDef = findMountByBreedAndSpecies(breed || 'Almendrada', species);
    const definitionId = matchedDef ? matchedDef.id : `${species}_custom_${i}`;
    const generation = Number(row[3]) || (matchedDef ? matchedDef.generation : 1);
    const rawGender = String(row[4] || 'M').toUpperCase().trim();
    const gender: 'M' | 'F' = rawGender.startsWith('F') || rawGender.startsWith('H') ? 'F' : 'M';

    let currentLevel = Math.min(200, Math.max(1, Number(row[5]) || 1));
    let currentXp = Math.min(867582, Math.max(0, Number(row[6]) || 0));

    // Sincronizar nivel y XP automáticamente
    if (currentXp >= 867582) {
      currentLevel = 200;
    } else if (currentXp > 0) {
      currentLevel = calculateLevelFromXp(currentXp);
    } else if (currentLevel > 1 && currentXp === 0) {
      currentXp = calculateXpForLevel(currentLevel);
    }

    let rawFertility = String(row[7] || 'fertil').toLowerCase().trim();
    let fertility: FertilityStatus = 'fertil';
    if (rawFertility.includes('fecond') || rawFertility.includes('fecund')) fertility = 'fecunda';
    else if (rawFertility.includes('steril') || rawFertility.includes('esteril') || rawFertility.includes('estéril')) fertility = 'esteril';
    else if (rawFertility.includes('senil')) fertility = 'senil';

    let rawCapacity = String(row[8] || 'ninguna').toLowerCase().trim();
    let capacity: SpecialCapacity = 'ninguna';
    if (rawCapacity.includes('sage') || rawCapacity.includes('sabia') || rawCapacity.includes('sabio')) capacity = 'sabia';
    else if (rawCapacity.includes('amour') || rawCapacity.includes('enamoradiza') || rawCapacity.includes('amorosa')) capacity = 'enamoradiza';
    else if (rawCapacity.includes('endur') || rawCapacity.includes('resistent')) capacity = 'resistente';
    else if (rawCapacity.includes('prec') || rawCapacity.includes('precoz')) capacity = 'precoz';
    else if (rawCapacity.includes('reprod')) capacity = 'reproductora';
    else if (rawCapacity.includes('camele') || rawCapacity.includes('camale')) capacity = 'camaleon';

    const isEsterilOrSenil = fertility === 'esteril' || fertility === 'senil';
    const serenity = isEsterilOrSenil ? 0 : (Number(row[9]) || 0);
    const love = isEsterilOrSenil ? 0 : Math.min(20000, Math.max(0, Number(row[10]) || 0));
    const maturity = isEsterilOrSenil ? 0 : Math.min(20000, Math.max(0, Number(row[11]) || 0));
    const stamina = isEsterilOrSenil ? 0 : Math.min(20000, Math.max(0, Number(row[12]) || 0));
    const notes = row[13] ? String(row[13]).trim() : '';

    parsedMounts.push({
      id: `mount_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      nickname: nickname || breed || (matchedDef ? matchedDef.name : 'Sin Nombre'),
      definitionId,
      species,
      breed: breed || (matchedDef ? matchedDef.name : 'Almendrada'),
      generation,
      gender,
      currentLevel,
      currentXp,
      fertility,
      capacity,
      serenity,
      love,
      maturity,
      stamina,
      imageUrl: matchedDef?.imageUrl || '',
      notes,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  }

  return parsedMounts;
}
