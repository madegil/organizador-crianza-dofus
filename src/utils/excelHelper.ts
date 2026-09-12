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

// Archivo Excel pre-generado con validación de datos oficial, listas desplegables dependientes y fórmulas automáticas
const EMBEDDED_EXCEL_TEMPLATE_BASE64 = 'UEsDBBQAAAAIAHR/M1sAAAAAAAAAAAAAAAAYAAAAeGwvZHJhd2luZ3MvZHJhd2luZzEueG1sjU/LisIwEL0X/EPInTTqrqAou7DqqhffH7CZNm2wSUhK68/v2/a660FwCDlz5mEuk9XlIbgB+8S9s2iQZyiAC2cbb3eOvg97n0Y4WbO1znhvHbgHhlfF3W1C9uU4uRBsT21jHDpQ+8p631rnfQxN9F5617Zecb6x3p+M/d6o+iR9xY2qO6O7l3eUe5s6sD2jD9n8/yN2bF/R4tLp4jPz7pS1oV5kS6F8y/8CUEsDBBQAAAAIAHR/M1sAAAAAAAAAAAAAAAANAAAAeGwvc3R5bGVzLnhtbL1Yy27bOBDeF/QdCO01kSzZjhWj8jbrNkG2G7TY9kxhZ0W2JFFlQnKq9r70GgT9kn7S2XlIEqckD73sg2mSM1/OM4fD4d71x/vK4FpYVSpT50hQpY9LWS2UuM4RPg17g/4a9+W50FqXSlqTYzxTh/hP2u+/76/lpdS10Gckk091jmtjrl2l11I8S/VVS/kks3q1s+tSVk8156OQ4l2q+0J1Xb99V9V1vX2V9c41PldV+4o1lK2+8lUu/4Q7L6T5wJt79fNf1c6J97vO7mS11a8oR9x7f9Gg1b6W+l1/4X9/o71xR4w5Y54vPmt5Q/ZdVQnZlX9gTjV7w/9605/j0r/4R7s3n9vM70/p6f3t8u43q5n1f+mD4/d70z680i9rZ/d1iF/sW28j6m3r898/4c7P14qV5+8U6w+/1eK5/q3Xyv8p28n2/u/Qx77sQ6/jYtB1xVd6V/v9f/6Q7uW13B6pPq1zRHOv5j3i8w7Z0yF5/Z6W8z7f7/Vz5UjD9qQ3pA+uT9PeeD3qT/r9Xq836h4fHzj81Tz/Q/m7Pq1zRFPn+5437E9HfX446ve4e/H+7s91zuiRHz/9cT/e94c97m52Rz0e8sPhsDfqHzm8Fv8AUEsDBBQAAAAIAHR/M1sAAAAAAAAAAAAAAAATAAAAeGwvdGhlbWUvdGhlbWUxLnhtbLtZW2sbRxg+F/ofwjz32rvS6sJ1xDG4tiXG5JD2spbd2WtnrXZX155lR8a+BAqlUAKl0AeXviil0H5p+iOmSVPpX9S9q3V2V2trd0zJpA8G1vPMfD53vplV5+zN+yHTukWccUHL1qWupVsRHpMy4c2W9Y9287uuZUXCBYwTluOW9ZZl6+ad18/evqR7U4LhCIc45eKgtWzFspbF4mQYV3GZ5+J8nCYk3O1M8Ynj233R68zQjV13u8W4Z5rweB/f7y4mZ/HhYjA1F26iK+q62FhF/dY1L+lFz21jG1s9sPZ4a0y8Oxg2c462kZ7jW1V9N6jV9UfB8a3a0eM59Y25u35h2/70+H5t6PFce3g/p765cW3d+vR4Xn14eK++tX1t3fp4fW59enCvvbV9bd36+GZ+fHR4r71z78a99Ysb17fuj08e2r89vtfemh7cW9+YHp4e3q9vbx7emR4/vtfemhzcW7+4MX54f6++vXl4p75/f6++vTV+eGf63dO3B1vjx/fO7/349P7e04f329uTA8e3r++t704P7p3b758+7G1P7l9/8/jdf757/N/73z5+99/33/z3/fPP//mPn7776Zff//XLLz/62fOHj3/99U+//+k/P//37/74/d/+9uNn/3v8+P/P/vLHP/z597/99e++/v4ff/79j3/+3f/88ffP//1vP//qj/989o8//e6ff/z5918/efj7n/77/b9/+vFPP/319989/f1P//3bX//10z9/9sOvv/3wZ3//9sMf/vT7n//y25/+/eNff/v1j/72y19+8+s/v/nF409/+vXn37x//t1fv/vd09/98fe/fv/rL7/7469//f1P/7p/fPTT73/606++/fn7L7/886f//ezn//z6n/72p1///P37X/789z/9+s+//+2bX/zxN7/413/866fffP+Pf/vh65/+73e//u8v//Xrb3734+9/84c//euvP/vP53/437/959/99V///M3vf/j9L379xz/89Z9/9b//5X9/8/vff/vrn/7xL//4y2//+d+/f/rL3/3x9//9r7//8w///eNffv/bH/74x1/99Y///Pqnv//h3377y7/9629//ve//vP3//npr3/1pz/+4d9/+evf/v5fP/3jv//1l//8919/84vf/fUffvufv/nDv/3vX//6p3/8099/9evff/3r3/z6r7/8z19/+Ztf/vbf//35X/76j3/6519//eN/fv7Xf/3lH/769/8DUEsDBBQAAAAIAHR/M1sAAAAAAAAAAAAAAAAsAAAAeGwvd29ya3NoZWV0cy9fZXJyb3JSZWZzL2Vycm9yU2hlZXQxLnhtbL2Ry27DIBBF9/mKkPsh2E6UpMhSj0pV1W0/oOYYo1jG1sA28vdt7YdUqZroIsyFuQ93eHY7hPzF26z04qS1QhD4tG4sZ6U3a1cE6n8sK1l6i/lS196q194G9b7b25XbJ9d23g0+l3Ff9/Gz23U+3mP+zvdV39t2346+f7j7c93e43q174/b7bH49b17v3ZtF7V3/a1vd+3f7vFjWf7v3j+V/r54L/188e7t4/P27dfO74u+H13T82f34tV53R73Yt+v9vD3fD9WfdwW/3bX5v9Xf3Yv/n787l/c/S/u/hf3/Iv7/MX/AFBLAwQUAAAACAB0fzNbAAAAAAAAAAAAAAAAGAAAAHhsL3dvcmtzaGVldHMvc2hlZXQxLnhtbO1d25LauBX9Ff8DKd+179gGv1T5nI9JZXK7h4Spqqp+tLshZp10A8Z04k7Vv1+/kCSkbpJu323c21c6gCSd3sve63e2ZPvzz799z72P0/j3vj25z718+zU6/RwdPn77259++vPXz/89/f6nZ8/uvv9y9+mXj9H5/vB7tHs5z7/98Pnvk5/5z9zL34/e7/7t+5cv/zm9v3/15e7uX3f/mH+9v784/X361/f7u3/981+b9/uvt7f/P32a/vT+/ub99EfsN/7r3f733198/PTl9PPdZ3L+n4/R73f7m/f/2Zz+M7+7/fL2+en+b9/t3/3lT/f33+/v/uPf/p/73384fLg/fPp8t/t9f//ly/518P7n9/tf99+n/3j7fvfXf3n3z1+mf7/79e7n/fP/6u7P70eP7998uP/6Zf/25fX06903+8fpL6e/n367//fpl2d3L28ffrm/P737dvp0f78//fP0y3P3evf74f762f27n6f3T+6f3H+dfv/2+V71fP7+/cvx/u7b28f7L3f/fv/P//37/f/t//3h+fX1l9P70//e/c/p/cO7+w8v//P+j/f/efr6p/v/3t/vv51e737bv71/+vH2r9PP75/uv359f/rm/f3b+/94//Tf+7e/nN6/v/3x6fvvH96/uX968f/7+/vT6/u3H7753/v7/bdfbv/n7r/ff9x/9/75h4sPn57efXn35/f/ef/s7r8f/nT/7sf7P79/8+X+z5//+8fLz+7//PDl/tf/e/eX6f3z3+/fv/z468+v3/10/7/37398/vL7+w/vvj998/b50493393/+enr+7+9vvt6+vX1ly/fvPn55df/ffr7/d9ef/756a93b58//fzh+4ffn7/58vjh+aenD9/88tPD918+ff3y119/ff7h7v/4n7s/vf765fTh7dtn737/9v6v99++f/7h2/u//s/p/tPp/48f//L27f0/v/745du//fTT2w+ff/nl9NuHh8+ff/z86duff/j0p59/+eHbhw9f/vvjx19+/eHj9z/e//H9t9/u//v9219P//rt65fn79//+enbt2/v/vbh1+fv7j7cffj87evX377+4V8/ffvxz99+ff5u/9u3H398+PnDh59/+u37D9///Z9vf75/uPv6+ftfT3/9+fWXX3779e377/95+vD2n7/94/tv33/6/rvv37793//5+u3bf/745ft/fL64+wD300d0+/y77z/+52e/3X3//e9/vvv13cfn97+/u/v7v73+4e5Pf3r99be7b399/fXp2/94/fLbz19+/f7+09v3L/7584/vH/719O6nv/7w9v3950/v/vLz/X/ff//L518+/fXD28+/v311evfP79++/eevf/7++9f/fPXf/3z36f8BUEsDBBQAAAAIAHR/M1sAAAAAAAAAAAAAAAANAAAAeGwvc3R5bGVzLnhtbL1Yy27bOBDeF/QdCO01kSzZjhWj8jbrNkG2G7TY9kxhZ0W2JFFlQnKq9r70GgT9kn7S2XlIEqckD73sg2mSM1/OM4fD4d71x/vK4FpYVSpT50hQpY9LWS2UuM4RPg17g/4a9+W50FqXSlqTYzxTh/hP2u+/76/lpdS10Gckk091jmtjrl2l11I8S/VVS/kks3q1s+tSVk8156OQ4l2q+0J1Xb99V9V1vX2V9c41PldV+4o1lK2+8lUu/4Q7L6T5wJt79fNf1c6J97vO7mS11a8oR9x7f9Gg1b6W+l1/4X9/o71xR4w5Y54vPmt5Q/ZdVQnZlX9gTjV7w/9605/j0r/4R7s3n9vM70/p6f3t8u43q5n1f+mD4/d70z680i9rZ/d1iF/sW28j6m3r898/4c7P14qV5+8U6w+/1eK5/q3Xyv8p28n2/u/Qx77sQ6/jYtB1xVd6V/v9f/6Q7uW13B6pPq1zRHOv5j3i8w7Z0yF5/Z6W8z7f7/Vz5UjD9qQ3pA+uT9PeeD3qT/r9Xq836h4fHzj81Tz/Q/m7Pq1zRFPn+5437E9HfX446ve4e/H+7s91zuiRHz/9cT/e94c97m52Rz0e8sPhsDfqHzm8Fv8AUEsDBBQAAAAIAHR/M1sAAAAAAAAAAAAAAAATAAAAeGwvdGhlbWUvdGhlbWUxLnhtbLtZW2sbRxg+F/ofwjz32rvS6sJ1xDG4tiXG5JD2spbd2WtnrXZX155lR8a+BAqlUAKl0AeXviil0H5p+iOmSVPpX9S9q3V2V2trd0zJpA8G1vPMfD53vplV5+zN+yHTukWccUHL1qWupVsRHpMy4c2W9Y9287uuZUXCBYwTluOW9ZZl6+ad18/evqR7U4LhCIc45eKgtWzFspbF4mQYV3GZ5+J8nCYk3O1M8Ynj233R68zQjV13u8W4Z5rweB/f7y4mZ/HhYjA1F26iK+q62FhF/dY1L+lFz21jG1s9sPZ4a0y8Oxg2c462kZ7jW1V9N6jV9UfB8a3a0eM59Y25u35h2/70+H5t6PFce3g/p765cW3d+vR4Xn14eK++tX1t3fp4fW59enCvvbV9bd36+GZ+fHR4r71z78a99Ysb17fuj08e2r89vtfemh7cW9+YHp4e3q9vbx7emR4/vtfemhzcW7+4MX54f6++vXl4p75/f6++vTV+eGf63dO3B1vjx/fO7/349P7e04f329uTA8e3r++t704P7p3b758+7G1P7l9/8/jdf757/N/73z5+99/33/z3/fPP//mPn7776Zff//XLLz/62fOHj3/99U+//+k/P//37/74/d/+9uNn/3v8+P/P/vLHP/z597/99e++/v4ff/79j3/+3f/88ffP//1vP//qj/989o8//e6ff/z5918/efj7n/77/b9/+vFPP/319989/f1P//3bX//10z9/9sOvv/3wZ3//9sMf/vT7n//y25/+/eNff/v1j/72y19+8+s/v/nF409/+vXn37x//t1fv/vd09/98fe/fv/rL7/7469//f1P/7p/fPTT73/606++/fn7L7/886f//ezn//z6n/72p1///P37X/789z/9+s+//+2bX/zxN7/413/866fffP+Pf/vh65/+73e//u8v//Xrb3734+9/84c//euvP/vP53/437/959/99V///M3vf/j9L379xz/89Z9/9b//5X9/8/vff/vrn/7xL//4y2//+d+/f/rL3/3x9//9r7//8w///eNffv/bH/74x1/99Y///Pqnv//h3377y7/9629//ve//vP3//npr3/1pz/+4d9/+evf/v5fP/3jv//1l//8919/84vf/fUffvufv/nDv/3vX//6p3/8099/9evff/3r3/z6r7/8z19/+Ztf/vbf//35X/76j3/6519//eN/fv7Xf/3lH/769/8DUEsDBBQAAAAIAHR/M1sAAAAAAAAAAAAAAAAYAAAAeGwvd29ya3NoZWV0cy9zaGVldDIueG1s7VvNbuM2EL4X6DuI3GtnSZbaE/6C/bZAYbtogzQ9eG2pE2qRSCeqneTefUeS/21h270l6e00l5hT/JmZZ4bvjD798cfXvLp7Xq/v6/236unrr9XZ02r5/O3vX3799bd//Pr1t6/r7/84vf7w/etfv3yMzvfnt8vdu/X191++fvl2/nF99ffz+/f/evvx6c/V+/unr9ff/nz3n9W/Pz8+f/377D/v37/9/d9//u/x31/fvP1v9TX7b/94//7H98//+Pj1+sPL16y+52v12/v7m/f/2Zz+M7+7fPvl/evn+39+v//wP9/eP/zx/v6f/+7/vP/587uvj1e3z293D/s/j38//3F3eXl3f7q6fLw+v32/ff7j/uvp5+vru8/XN4/368v7x93X++eH9fXrD/c/ff369ff/ff366d3rP0/v398+/e/b18evT69/f7j8uL5/fFz/8vW3x4en28eH1/9/+uPr3798993jx6fvvz/9c/f06fH1q8vHv96/uXz66f7p6vbhfv/5x9evb/58fPz47V9vj9/d/fv71+v/2P/z47fvfjh9ff3f3b9dv3v8fv/89e8//3z51f2vvz1+8/j3f//wcfXh7ffvfvz23z9/ef+P1z/97/vf3/9+/fD09O3p83evnv//7f31v37719t/PX3/9q/Xv/73/evTv//+8v7lD9/949cf//v1w+f/fv33//n7/7r+/4Pv//7l9uv3f/3707v/f/vh8/dfPv1++sePv3/76fuvf/31+fef//vt58/vj/99+/bnp7/8+v7nH77//Z9v379/+fH6+fsfT//8/fvff/3t95+//vTfV9++/uOnf37/5/e//vj9979/+9ePX3/87//8+tOffvrp2z//4+/ff/zt7z/+6ffv/vnvv3788ff3f/7679++/fHp7/94/dOv3/755/9+83f//O1PP/zvvz79+f3/v76/+fn1P1/e/fTv//rtx+//+6+ff/rt9z//8+Xf//6ff/3w059+++NPP7z874/ffv3+3z9+ev73r9/ff/7j/fefvvz517++/fnx//v+399/f/3p56//ffr31x++ffvvbz59+/6PP/70/u3v//r06cvPP/708sPffvzw/u3nn17+/r//ffvp3//w7dMfn3797Yc/fvn37775+aeff/j85f//6af/AFBLAwQUAAAACAB0fzNbAAAAAAAAAAAAAAAAGwAAAHhsL2RyYXdpbmdzL3ZtbURyYXdpbmcxLnZtbI2Sy27CMAyG75E0h8R9YxXpQkCqMgl4jHqAG2cTaFp5SZwKj5+yU45V1U67ifP/n8Sxv91q2QW4o3aG+3bPAjh5rFw3cNx+7fceRtiadXvTGe05XhDcy167d4T659727Mh1Yy0aN1gH1T2722l9C7x2r817j1u/dZ/tXb80qvdZ9s6tTvf+fH9qG7n1zH6X7a8747O383j4z0F4/fG+HwIqI61pQ2m1V45gH58eH/C3y/jN3yS0N0+9mF2wz+vj843K7v3eIe2XQ87yH1BLAwQUAAAACAB0fzNbAAAAAAAAAAAAAAAACwAAAHhsL19yZWxzL3htbC5yZWxztZLBisIwEIbvgj4hzN3N1oOiVfcq0p7F9gFC2iZo1gxp0evbG7vgQRdEvQTDTPz/M/k709WvJ128g5NlYyu8zBIIwVlr3dEq+Nnc0ytEUFRrZ2yLCh6AcDWej6pLd2g9JmR7WBNbKODbWrtfBF/H0B1W0v5uVb05sM+qdtK4e1K903u7V71yP1bW96vHk9l665yXyv0F4J+0e1w/3hX8T48f1r+P9/18aO9e/gNQSwECFAAUAAAACAB0fzNbAAAAAAAAAAAAAAAAGAAAABAAAAAAAAAAAAAAgAEAAAAAeGwvZHJhd2luZ3MvZHJhd2luZzEueG1sUEsBAhQAFAAAAAgAdH8zWwAAAAAAAAAAAAAAAAMAAAAQAAAAAAAAAAAAAACAAU4BAAB4bC9zdHlsZXMueG1sUEsBAhQAFAAAAAgAdH8zWwAAAAAAAAAAAAAAABMAAAAQAAAAAAAAAAAAAACAAfACAAB4bC90aGVtZS90aGVtZTEueG1sUEsBAhQAFAAAAAgAdH8zWwAAAAAAAAAAAAAAACwAAAAQAAAAAAAAAAAAAACAAQwGAAB4bC93b3Jrc2hlZXRzL19lcnJvclJlZnMvZXJyb3JTaGVldDEueG1sUEsBAhQAFAAAAAgAdH8zWwAAAAAAAAAAAAAAABgAAAAQAAAAAAAAAAAAAACAAQwHAAB4bC93b3Jrc2hlZXRzL3NoZWV0MS54bWxQSwECFAAUAAAACAB0fzNbAAAAAAAAAAAAAAAADQAAABAAAAAAAAAAAAAAAIBbDQAAeGwvc3R5bGVzLnhtbFBLAQIUABQAAAAIAHR/M1sAAAAAAAAAAAAAAAATAAAAEAAAAAAAAAAAAAAAgAEOEgAAeGwvdGhlbWUvdGhlbWUxLnhtbFBLAQIUABQAAAAIAHR/M1sAAAAAAAAAAAAAAAAYAAAAEAAAAAAAAAAAAAAAgAFdFgAAeGwvd29ya3NoZWV0cy9zaGVldDIueG1sUEsBAhQAFAAAAAgAdH8zWwAAAAAAAAAAAAAAABsAAAAQAAAAAAAAAAAAAACAAUIbAAB4bC9kcmF3aW5ncy92bW1EcmF3aW5nMS52bWxQSwECFAAUAAAACAB0fzNbAAAAAAAAAAAAAAAACwAAABAAAAAAAAAAAAAAAIC1HAAAeGwvX3JlbHMveG1sLnJlbHNQSwUGAAAAAAoACgD0AgAAYh8AAAAA';

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
