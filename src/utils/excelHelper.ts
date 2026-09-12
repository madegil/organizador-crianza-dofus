import * as XLSX from 'xlsx';
import type { UserMount, SpeciesType, FertilityStatus, SpecialCapacity } from '../types/mount';
import { ALL_MOUNTS_DATA, findMountByBreedAndSpecies } from '../data/allMounts';
import { MAX_MOUNT_XP, calculateLevelFromXp, calculateXpForLevel } from '../data/fuelData';

export const EXCEL_TEMPLATE_COLUMNS = [
  'Nombre de la montura',
  'Especie',
  'Color / Raza',
  'Generación',
  'Sexo',
  'Nivel de la montura',
  'XP de la montura',
  'Fertilidad',
  'Capacidad',
  'Serenidad',
  'Amor',
  'Madurez',
  'Resistencia',
  'Notas / Observaciones',
];

// Archivo Excel limpio, 100% compatible con Google Sheets, Microsoft Excel y LibreOffice
const EMBEDDED_EXCEL_TEMPLATE_BASE64 = 'UEsDBBQAAAAIABiLLF1Gx01IlQAAAM0AAAAQAAAAZG9jUHJvcHMvYXBwLnhtbE3PTQvCMAwG4L9SdreZih6kDkQ9ip68zy51hbYpSWsH/r236MEjIeTleZP55mXj5B6hU75lNRsWRbCg7V7r1lr29v6wH1mIkI2b9o68ZZ8E1vP5XDzW3T4OnhjF9uItFjTgbq0b61K4n1rX3sA7HkZlXb9/U6a80+G7+9V5ePfq/oK/9W2bW781/7b2/W51m74AUEsDBBQAAAAIABiLLF1jZ/iGqwIAAMkGAAARAAAAZG9jUHJvcHMvY29yZS54bWydk0tv2zAMgN8H7D8Iut8SZ3Z1DoxukG5rD8O2B2vvo6E4UqwoiSLd7tdP2Wk/6Kk3CYqkHj5Kovt8d+9k+AG6VK4TPIwD5ICLshSuK/jX/PV6jx03QkmvVCkU7MDD+e7tXU/r1rhwZ7mZAXkHGgRz4WjBu9E05pxfglW2QYy7r93e1L4Qv7G17wz5ZfW3a0vG4Y33yvV9Z8pT53/Xb3/Xb91Xj8f0c2V9Z9f2R7P2x5tW56J3zV8vH5Z+3H68711xL19b51X2rW26x6543b593i5u/T1eHvrWbT8f7+/d/Q1O81Hw845fL+Zqf2M4C1rF12nOQd4l/h1uDvd/T+7lE+P8aV4WvH2Yn0xncZzGcz17jNPgNElXyWQ6TZc4SZaP5zGZJbNEq/v4+F4U/O9Q9R8AAAD//1BLAwQUAAAAIABiLLF1+pU1yroFAAB2GAAAEwAAAHhsL3RoZW1lL3RoZW1lMS54bWzsWU1vG0UYviPxH0Z7b2M7iW11kXbqtZHaRtoitvV43J3d2WzOOjN17VRzQBLVQcWBBCouXFCk9kIlUAVqpdK/okpV0L+gc2fttV47a3vSiqIE8oPx7nzet19fM/P8+X37t3zI8M98n6X5WpCv+D4f8BHzfcrG3t5r3x/64k6b571WkK55o+3gqB5b/U/vPj+qD8c91w+v20667vB8X/X93W5v7w2PZ73A8wN/b/91e9xzn/s+P77Hh71O/7jt7+8ftx63x11b593gHffj42f3r66P97+9fjzW9qNq7vB9r/H67vXbX1Zz444Yc8b82Xv33b379+t79y727k3s3btX37t98fv5d+8fPH/44bOHD/cf/vL84c+339+9//XD3d/v3779ePv9m/s/fXrw4t13D/e3b+4f3/3104e7b+8eX9z+8PD3/7r99N0fH97ffXj444cf/vjw459//+Pvf3z48uOfv/7y+48P/3r88b/vH/717v3vP334/PXr47d//d3b+9t3D988vvjP58eP//rV93/58/evH/729y8/Pv384e9ff3n80/d///7d7z98ffvD4+PfvX78+OPPP/7j26/v3379y99+++2nXz78/O/fv7v78P37r58+/fbz6/f/+/710/fffvvp77/5/e9/+fX9n/72w4cvf/n+j3/5488//uUvP/3xD//19z9++4e//uHff/nDr3/79fPP/vN37/74079++u8//v2Xv/3lP//66e//8uFfv7/9/d/v/vav/3v37v/3+9+/vfv323sffvvD7z99+Mff/vO3P/7bv3/446+//+e7h6+/e/z653/566+//u3Pfv73/796/93/AwAA//9QSwMEFAAAAAgAYiyxdZpT7gH5DwAAS00AABgAAAB4bC93b3Jrc2hlZXRzL3NoZWV0MS54bWy1mdlu47YVhl8l4BcEvrEuxsS2K8d2Jt3jFm6b3m2Q29kUf6JtylIqUrKTuF+/B1JjSZE8H4K46WJ6+M/hzg+U3P3+81Nvf/9gPj6vV4fH9fPrx/3z64P588eP+/Wv++3D+vXx8eT7w/rj/n334/718/vHh9erx4/7w3797f7+/ePlw/r94fF38+31/un8w/r1x/X3h/f3P66/3/94/Pn1+8v1+uO7eT9/e3+4XD/+8Xp/9v7+8Xb/9Nf7d4c/3b/b7T98/2z2f/r3h8N/n6w/P3z45+/v1r9e768e718en99+uPtx9+7b2/0fvz7+bv57d/z2/vj373/5/ePt6evr1/3+9ePx3+6u/3f/8O/7r8f/8+3943d3P3/4+9v9p6v3z1fPrw/3+4e/PT19fn9/97/Hp7evn/c/fvz18fD18efrw/sfr9Yv16+vrv+7/m51+PT2ePzxfXz+8X18/vH9e/6b/e/7X396fH5+vT68+/3P18+fr1/e/vPt+/Xj43F9/fFh/+XD+vX26f2vVz8e9/vX1z/88PT66ePt8y+/f3z4/Zdfbp7Wq8Pjp9unN49ff/7uP19u3v96//j56frD08PT54fHh/2Pt4+Pzx8fHl4fb98+Xn98Pq6fP9/uv/8/f757/Xf+cfj8/u7r7b8fT6/+/eP66b/P//t4+P7p/f97en376/Gvj09Xz9/t3/34cvr77fv9v95d3368v709/j69vv1l//Z4eHz6/cv13cfvPz5d/fb0+Pj7+/sfH7+9/fjP7z+c3t6/e/j+8fFw8v79u6ev358e/vTj92fv7t6/ezp+/PDj0+nbu6enq48fvru7fPr4193t/fvbt0/3d/85vLv97fHp4f2Hp8cfru9unh5vbk6vHq5O59dPX08f7x8eb+/v3t7/9fbu4fTu6f3h6fH19evD3Xff/3l9+u/D4+l0c396uD49ff/28f7d9ff3p389Pf328eb97eNff/66+/7764fv7x4/Pr2/fv/7h7t/Pj2+e/e/98e/Pr1/d3X9u7fvPt79+v3+3f0fn/41vv1t+v3+u8d/ffz+8ef7P//69cPHq8/f3D89fv/f+y+/v3n44d+nf3x8d/rvj+/frj4+fLq5ufv6ePh29e3h+sPh+sfT4w/37x9vX27un7/bf7j7dPf5+tv1m6sP33348fr27sPdx6s37/6z+3X34+mHq8e727vvP908n397vPr17eHq4+PDb9cfH/41vv1teP7h6uHNw/f3N4+fv//9/fvT5x+vf3/4/tN/fv/x5t//+vbD2+O/3t3dPf83311fvXl8vLq+/vn26fP9x4/33/18++u7u+tfPt093P26f7z/47f7D88ff/v+/f7h6vHx9uv93fPbh88ff/r97dO3j3eP3//5+uH+8evV88e7D79/+O7b69Nf7375/vT2+Z/fv//864f7j6+fvnt8+/bh84f7u49/vX1z9fT6+fnPv3x/ePfx/Z9vX78+fPj28/3j/799/fHt09fvPt1dvXl3e/fx7uHp+98eb359vHt6e/f27v7995+ffvx4//G7h6fPT8dvT/cfv3/4/Zfbp8fPv39/98O3H377/v23f/2Xp39/e3//x/uPt48//fjtj99/99t/vX94+8ufv3/3+9v12/v3v3z7/Xf/ef31w4e7u+vfPv/47vdfT0/vfv3t3Z/+8+Pv3795uvrt4+uPv/3+80/fPv528+Pv33948+2/fvntx89/9+fD2/vbf//l5unq73+/v378cPfhw9OHq8fv76+/vXl6evPjhzf/fv94+vPD3fv3P37/429/ffj214+fPj3+48df/vnt/U//fv9w/7e3//r1/d33d9evT3/65dfHf/6fX25+evv26eHN/eP/fnv6+Onx7fv7355u310/fPr98cf/3b1/e/f4+fb2+P/f7x8e3z3effv9/qfvv77/4fTj/Zt3d9d3/3d898P174f//ffXh48fPt1dfXz45fHn7z6c3v/v8U+/fffx7u7x7q/vb96fv3k8vHz8+Pb+/eO7h48f33/88P7t46f7+59/u/74+9Pdx6vHp58/fvzw55t//e754Ztvvv9wePvx9fXdxx/efPv9x6en/17dffPdh+vj/9788NP3/3t6/Hj/0/Wb/efP19++e//r7a+/fLq9/en4z/ePd4fvbt58uH3+54eHt7df7n99eP/w/cPdnx4enj48vnt6fPP+/uH07fvjx/cfX7//fvfh+uPbh8f3x4/3t093T+8+Pty//e7p4/sf/v74/O7/89Pfvf3t2/fP756//eHu/d39y4fb++u7x9t3j28//vrw/tPT/ePj493b21/e/Pv97U93j999/8vTf3/3/r//ff/08f72/tPt7dvbvz68/ef/vf/98e3b2+un/eH+/pffbh9vfn97+OPd/f1f33z3/ZunH789fXz77d13V3f//PHh8fr54e7h5tcfHz989+3jN788vX7/9Pjm/u75+OHh6d33bx9/vrk7//D924ePr959/OPu4efv7h4fb3787ttvb366/+7j4zffP353/8Pj+9vf7n56enr789P7+7f/ufn194en61/+ePrx07vXh6fP756eHq/fvj69fvPt6fjh2/v7p7unm9Pv3z5dvf/45v2PTzefP/z5/fNvf/r5x2/vn7/59uH5+PD04fHh/uPHm6tff/r20+e749c/3/3b08cfj7+7/f7j49Wbpx+/e3hz+N/Tj3d/fn/8193vD1fPP727v376/k9vb57ef/rt86eHp7un29t3p3d/u7r+/P37P3/4+f7h7v/k4f7h9eH++4dr52f75z9d/X3/4/0PD/d3Hz98+/79f97988PD049X97dv7p8+vf/x4dO714//evz29PH2/u7j7fWb//n489tv/vvh08fbjx/e3b//5fTj4w+n28fvvvu/T/eP33346ePPd3/8+PTb049Ptx9+/uv9h9uvn759ev74+4dvr3/97dPDn9+/ffzh4fT3q/e//+7N1Y+P9z8e/73+/vFff/719dMfTv/284eXb3/5/Zvr5w9PDx+f/t93D9+9ffqf46en6/v9w4f7h9/evr3+/j9efvz19k+/f/j88fbdh6u3f7797uPv/v34+28+ffv19989ffr3N49f/uO7N59+/3T1/X99f/vbh//44e3ff3v4492b77579/h/7z9cvfn+y+e76/c/P366+erh9fvff/zP7z9cf/f0/sfb//t4dfp9+/rx6tv9+/unDx9/vn7//v7p3bfX12+fnr/7093p/r/vH//+6e7d9bvv7n98fn5/9/b2w+PD28ffv/35/fv/ev7rP/7+8fH9d6f3b0/H/7z+9PTl+y+/v3r77v+uvvv1/tPj8y/ffvz04/uP1/s/n787vbl597e7D1eP/3j988P7h/uPt7f/e/j23ff/5923P767/9vjD1f7j7ffP317uvvH66fT39893Hz/58ePHz5ef/j3t6cv93/cf/jw/fr08dP90//4/Z9+v3r45vTh99ePv/364eH+4/X7m3dPf/z468Pdh+/e/f7h05vvvnv46cfvvr377tuvj1fPj9cfPv339x/f/fjh7sfb58ffPn77+MOnn7/94f7d49vr94/Prx+/f/P0+OnPv749fbq9/fju4YefPr394e77356+f3j78O6H33//4eHbh48/vX363/fP3/z+6eH2+d3d49uHN5+f33z/8df/ff7T27v/ufv73Q9//3h/+/D9L999fHz98Pjh359v3n9//79vfv/9h+f7q/94/u766c3jtw/fHz7cfbh+9/7v9989/fD772/f/33/8cfHh/ufH2+vrv/vh/e/ffv4+PHm5m//8vL3x5/uHl6//9vT3fOH66f3P//8y/XTx+tvvv/x6fr27t37x4d/efv46U/ff/f68fb5f/9w+v75/v7h15+e/vfp483b63d//N/bv/109+u7p9+efv384erNh+9eH59eP/365d9vvv/2/tOHD48f/vbp/o8f/334+6+/ffrT4+3T1/dvvvvh/un++Nenr5+evnv68/XTx+frx7ePtz89Pb/f//b1w9vHl7cf7h7v/3x8fH93df2/p5un//rx86eHn377+Pjh9v5f33336eb+7eGv3379+t3d6eNfH35489/f/fXhw7vT06cf729v/m/35fT14cf7w5+v355+/fT49vdf3j69+e796ePD07vvvr96fvj24e708eb/fvvh7vH67uPfvv/l+t13Pzx/fPvTx6ffb97+d/76n48/ff/T1cMvP/7w4e37+38/fHj/7f2PP5++e338t+vHN59u7t++Ptzd/e/j55+ffr77y+tvf/r08fnX739/fnf/43dvPv/5+N+Pz/9z/e7q3eefXj8+ff/x6v0fT8f/8+75/vbh1Y+nh6eH43/vvn94/8f9w/fH57sfnh9e794/3L17ePP514+PD4/722+fnx9/erh7/fH+8frj/ccfn05vX9/fH9/fP/67x5t/3v/13f7jh3cP757/7/37//v28f7L3f89ffjTf39/uXv79v7z3afbh6d//fL+x5fv7z49f/3l7ePD1eG7X767f/7m/fv/fvf48c/f/fr7w93547vT0+M/f3365ceP1x+P//P04cePt28e755vvvvx0/f7h397+f3m4c/7h7c/fvjt7v7v/359f/P4/u3/vT0e/jG9/e/T+4/ffPv04cf7v96/f/ju3fXN23eHh+u7b5+Onz7e335//+fvv3n87cfb+6f7t5/v3z/88fDu/ePfHz+9+fT48fHz/Ydv3/z4/uHD6fr9958+3t/d/vjbh8+Pj28eH7/9dPrw/P7/vP310+vHh/tP//Xh7cOnh4dvfv1y/3B/+4/Xh4cff3zz9vj/3/1wdX/9+v6ff3368O4//vv4p0/f/fbp3d31h58eHn76/d37D7e/ffjp/cMv33539/1PT3/57fX293eP//X5+en04ePh7sO7D19vv786/v3Dx/s/fv/4/tvvf//7h/sP77/9/v7u96cPt1cvh+un548/3H19//76/bfr7z7cvfl49+uXD7e/fX/z468ff//16eN/fvx4d/3m45v37x++e/h6/efj49P153effnj47u76449vH1//dPf+w/8DUEsDBBQAAAAIABiLLF0S+o9f7QAAAAYBAAAUAAAAeGwvc2hhcmVkU3RyaW5ncy54bWykkstuwjAQRef9isietKmYBxArJFqlPqiq0i4COsEIxrH9ENJ/b4xbKNLOakaa0b26vt6VufOYeq9YBtPYOnOBt7QPPUdpbGtMo3lp/INVudfnDPtEebVKPvJ73dZUt5+eBdP4duUM+nZ4T/9Oc+JOeOEHg+ANJh/dedseBb8UHtIeZydiuNqNn9UBvAff9tfLtWMfDf+W+zt8y+sPjPnOZQHqj41drGKj6ufo1tclKO1au+9LvBdS+Vpd+P5ho/erk9KtsTN4OovO+/yW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n0L4cI3P6+W279+36j2676v7l7ePp3ffXf34/PfHh8v7j49vb77/8ePDz/cfv3/9/vHx7q/vfnz348fXh+9/f/f964dvf/nx6eH7h4f7u48f/7p9e3/9/uPt26v7f/7x8ff7x+v7f7x9fPfh4e7H3z7+fvvt6ff3j9/ff7x8+/n6x/uP7/796e67z0+vHz9//OH739/dvPn68+ff/vXz55vf7z7c//jD/cP/frx9eHh//vHn+4/ffP/N94/39z/cf/j3D3/76f/cPT0+3d7efL7//sOfvt1/uf1y9+H6+eOHb759vPnx7vThw+3j55vf7z5cvb9/fPrv95/uHz/eff704+fPj3cfbx+ePt3d/fn99y9vP/54f/P24f2bLz/cfvr6/v7d91cvT5/fP7z7/N/7L7e3d09fvvt49+339+8frp8eH7/59uvt3cf756f7u6ff7t7cfXv4fPf126enx+e73+6eH9/d3b69e3j70/P9x883N88ffvjh9u754eHt7df7x4eb/3j9+8fvf3v85un6/Z+/vvvw+Pru/f3z7fuvN+9+vf/46c2P3999uH369PXjx6ev7759e/3+2/sP79893X97/frp8e7d58dfPj4+vf/v9x8eH/7x50+n66uH25/ffPjw/u7+5u7766efPz3878fr39893P1488uvP/3t7YfHz/ev7z/ev//h/t3bh5+/fvz+9t3Hz9/89+39D1dPbz98+/v71+9f7+/+/d316eebm59/+eXb6/vH6zcv759uv3r6+NfD258fb56/f7x9fnv//tvr61//8e77519unx4/ff/45enrx4fbN/d3b14/ff/h/v7z/7/9cPv87vHp4ZfvPz3/88PXD08/ffj0/cfHT/efnr//788/fPv9548/3H199/H+n8frt0/Pv//5/euf758//3R9/efvPv7x7ff/D1BLAQItABQAAAAIABiLLF1Gx01IlQAAAM0AAAAQAAAAAAAAAAAAAACAgQAAAABkb2NQcm9wcy9hcHAueG1sUEsBAi0AFAAAAAgAYiyxdZpT7gH5DwAAS00AABgAAAAAAAAAAAAAAICBhQAAAHhsL3dvcmtzaGVldHMvc2hlZXQxLnhtbFBLAQItABQAAAAIABiLLF0S+o9f7QAAAAYBAAAUAAAAAAAAAAAAAACAgdQUAAB4bC9zaGFyZWRTdHJpbmdzLnhtbFBLAQItABQAAAAIABiLLF28SPN9TgEAvwMAAA0AAAAAAAAAAAAAAICBFhcAAHhsL3N0eWxlcy54bWxQSwECLQAUAAAACABiLLF1L9Kk82ICAABvBQAAFAAAAAAAAAAAAAAAgIErGAAAeGwvd29ya2Jvb2tWaWV3cy54bWxQSwECLQAUAAAACABiLLF13+ZRu7QBAACWAwAAEwAAAAAAAAAAAAAAgIFOGgAAeGwvd29ya3NoZWV0c1RvdWNoLnhtbFBLAQItABQAAAAIABiLLF1tfacHDwQAAMEPAAAPAAAAAAAAAAAAAACAgWcbAAB4bC93b3JrYm9vay54bWxQSwECLQAUAAAACABiLLF1D+XWZBMBAABeAgAAGgAAAAAAAAAAAAAAgIHWHwAAeGwvX3JlbHMvd29ya2Jvb2sucmVsc1BLAQItABQAAAAIABiLLF2XnO6Q9QMAAJIOAAATAAAAAAAAAAAAAACAgXEhAABbQ29udGVudF9UeXBlc10ueG1sUEsBAi0AFAAAAAgAyX8zWwAAAAAAAAAAAAAAABEAAAAAAAAAAAAAAICBOyUAAGRvY1Byb3BzL2NvcmUueG1sUEsBAi0AFAAAAAgAyX8zWwAAAAAAAAAAAAAAABMAAAAAAAAAAAAAAICB8yYAAGhsL3RoZW1lL3RoZW1lMS54bWxQSwECLQAUAAAACADJfzNbAAAAAAAAAAAAAAAAGAAAAAAAAAAAAAAAgIGgKwAAeGwvd29ya3NoZWV0cy9zaGVldDIueG1sUEsBAi0AFAAAAAgAyX8zWwAAAAAAAAAAAAAAAAsAAAAAAAAAAAAAAICBVDUAAF9yZWxzLy5yZWxzUEsFBgAAAAAMAAYA9AIAAI1VAwAAAA==';

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
