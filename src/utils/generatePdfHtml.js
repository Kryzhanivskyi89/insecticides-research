import {pdfStyles} from './pdfStyles'

export function generatePdfHtml(actInfo, experimentData, activityResults, conclusion) {
    const safeGet = (data, fallback = '—') => data || fallback;
    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('uk-UA');
    };

    const firstSample = actInfo.samples?.[0] || {};
    const samplesData = experimentData.samplesData || [];
    const controlDays = experimentData.control?.days || [];
    const allDays = Array.from(new Set(controlDays.map(d => d.day).filter(d => d)))
                     .sort((a, b) => parseInt(a) - parseInt(b));
    
    // Блок 1
    const block1Content = `
        <tr>
            <td colspan="3"><strong>Дата передачі:</strong> ${safeGet(actInfo.actDate)}</td>
            <td colspan="9"><strong>ПІБ особи, яка оформила і передала зразок:</strong> ${safeGet(actInfo.transferredBy)}</td>
        </tr>
        <tr>
            <td colspan="5"><strong>Назва препарату:</strong> ${safeGet(firstSample.name)} ${safeGet(firstSample.subtype)} ${safeGet(firstSample.state)}</td>
            <td colspan="5"><strong>№ партії, дата виготовлення:</strong> ${safeGet(firstSample.base)}</td>
            <td colspan="2"><strong>Кількість, шт/мл/г:</strong> ${safeGet(firstSample.quantity)}</td>
        </tr>
        <tr>
            <td colspan="5" rowspan="4">
                <p><strong>Препарат виготовлений:</strong></p>
                <ul>
                    <li><strong>за яким Розпорядженням</strong> <em>(для комплексних препаратів)</em></li>
                    <li><strong>за якою рецептурою</strong></li>
                    <li><strong>із якої культуральної рідини</strong> <em>(для монопрепаратів)</em></li>
                    <li><strong>інше</strong></li>
                </ul>
            </td>
            <td colspan="7"></td>
        </tr>
        <tr>
            <td colspan="7"></td>
        </tr>
        <tr>
            <td colspan="7"></td>
        </tr>
        <tr>
            <td colspan="7">${safeGet(firstSample.base)}</td>
        </tr>
        <tr>
            <td colspan="2">
                <p><strong>Завдання:</strong></p>
                <p><em>(виділити / підкреслити необхідне)</em></p>
            </td>
            <td colspan="10">
                <ol>
                    <li>Визначити інсектицидну / акарицидну активність препарату;</li>
                    <li>Встановити тривалість дії препарату за показниками смертності комах;</li>
                    <li>Встановити оптимальну норму внесення препарату;</li>
                    <li>інше <em>_____________________________________________________________</em></li>
                </ol>
            </td>
        </tr>
        <tr>
            <td colspan="2"><strong>Показники якості:</strong></td>
            <td colspan="2"><strong>Водневий показник рН, од рН або масова частка вологи, %</strong></td>
            <td colspan="2">${safeGet(firstSample.ph)}</td>
            <td colspan="2"><strong>Титр КУО/мл (г), (початковий)</strong></td>
            <td>${safeGet(firstSample.titerInitial)}</td>
            <td colspan="2"><strong>Титр КУО/мл (г),</strong> (<strong>зберігання)</strong></td>
            <td>${safeGet(firstSample.titerStorage)}</td>
        </tr>
        <tr>
            <td colspan="2"><strong>Примітки:</strong></td>
            <td colspan="10"></td>
        </tr>
    `;

    // Блок 2
    const block2Content = `
        <tr>
            <td colspan="7"><strong>Дата отримання:</strong> ${safeGet(actInfo.receivedDate)}</td>
            <td colspan="5"><strong>Отримав:</strong> ${safeGet(actInfo.executor)}</td>
        </tr>
        <tr>
            <td colspan="7"><strong>Дата закладання тестування:</strong> ${safeGet(experimentData.layingDate)}</td>
            <td colspan="5"><strong>Період закладання тестування:</strong></td>
        </tr>
        <tr>
            <td colspan="7"><strong>Повторність:</strong></td>
            <td colspan="5"><strong>Цільовий об'єкт тестування (шкідник):</strong></td>
        </tr>
        <tr>
            <td colspan="7"><strong>Культура:</strong></td>
            <td colspan="5"><strong>Харчове середовище:</strong></td>
        </tr>
    `;

    // Блок 3
    const renderTable3Body = () => {
    const allDays = [];
    samplesData.forEach(sample => {
        const sampleActivity = activityResults.find(a => a.sampleId === sample.sampleId);
        if (sampleActivity?.activities) {
            sampleActivity.activities.forEach(activity => {
                if (!allDays.includes(activity.day)) {
                    allDays.push(activity.day);
                }
            });
        }
    });
    
    allDays.sort((a, b) => parseInt(a) - parseInt(b));
    
    const getActivityByDay = (sampleId, day) => {
        const sampleActivity = activityResults.find(a => a.sampleId === sampleId);
        if (sampleActivity?.activities) {
            const dayActivity = sampleActivity.activities.find(a => a.day === day);
            return dayActivity ? `${dayActivity.activity}%` : '—';
        }
        return '—';
    };

    const controlRow = `
        <tr>
            <td rowspan="1"><strong>Контроль (вода)</strong></td>
            <td>—</td>
            <td>—</td>
            <td>—</td>
            <td>—</td>
            ${allDays.map(() => '<td>—</td>').join('')}
        </tr>
       
    `;

    const sampleGroups = {};
    samplesData.forEach(sample => {
        const key = sample.name || 'Зразок';
        if (!sampleGroups[key]) {
            sampleGroups[key] = [];
        }
        sampleGroups[key].push(sample);
    });

    const sampleRows = Object.entries(sampleGroups).map(([sampleName, samples]) => {
        samples.sort((a, b) => parseFloat(a.concentration || 0) - parseFloat(b.concentration || 0));
        
        const groupRows = samples.map((sample, index) => {
            const isFirstInGroup = index === 0;
            const rowspanValue = samples.length;
            
            return `
                <tr>
                    ${isFirstInGroup ? `<td rowspan="${rowspanValue}"><strong>Зразок: ${sampleName}</strong></td>` : ''}
                    <td>—</td>
                    <td>${safeGet(sample.concentration)}%</td>
                    <td>—</td>
                    <td>—</td>
                    ${allDays.map(day => `<td>${getActivityByDay(sample.sampleId, day)}</td>`).join('')}
                </tr>
            `;
        }).join('');
        
        return groupRows;
    }).join('');

    return controlRow + sampleRows;
};
    const block3Content = `
    <thead>
        <tr>
            <th rowspan="3" class="block-header"><strong>БЛОК 3</strong></th>
            <th colspan="${4 + allDays.length}"><strong>ТЕСТУВАННЯ:</strong></th>
        </tr>
        <tr>
            <td colspan="${4 + allDays.length}"><em>Дані вносить спеціаліст, який проводить тестування на</em> <strong>визначення інсектицидної / акарицидної дії</strong></td>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td rowspan="3"><strong>Варіант</strong></td>
            <td><strong>Норма витрати,</strong></td>
            <td><strong>Концентрація робочого</strong></td>
            <td colspan="${2 + allDays.length}"><strong>Результати досліджень, %</strong></td>
        </tr>
        <tr>
            <td><strong>л/га</strong></td>
            <td><strong>розчину, %</strong></td>
            <td colspan="2"><strong>Ураженість</strong></td>
            <td colspan="${allDays.length}"><strong>Смертність через </strong></td>
        </tr>
        <tr>
            <td></td>
            <td></td>
            <td><strong>... днів</strong></td>
            <td><strong>... днів</strong></td>
            ${allDays.map(day => `<td><strong>${day} ${parseInt(day) === 1 ? 'день' : 'днів'}</strong></td>`).join('')}
        </tr>
        ${renderTable3Body()}
    </tbody>
`;
    return `
        <!DOCTYPE html>
        <html lang="uk">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Протокол № ${safeGet(actInfo.actNumber)}</title>
            <style>
                ${pdfStyles}
            </style>
        </head>
        <body>
            <div class="protocol-header">
                <p><strong>Протокол №</strong><span class="underline">${safeGet(actInfo.actNumber)}</span></p>
                <p><strong>про передачу зразків та випробування біопрепаратів</strong></p>
            </div>

            <table>
                <colgroup>
                    <col class="col-7" />
                    <col class="col-8" />
                    <col class="col-15" />
                    <col class="col-5" />
                    <col class="col-7" />
                    <col class="col-3" />
                    <col style="width: 0%" />
                    <col class="col-13" />
                    <col class="col-11" />
                    <col class="col-6" />
                    <col class="col-7" />
                    <col class="col-12" />
                </colgroup>
                <thead>
                    <tr>
                        <th class="block-header"><strong>БЛОК 1</strong></th>
                        <th colspan="11" class="block-description"><em>Дані вносить спеціаліст, який передає зразок</em></th>
                    </tr>
                </thead>
                <tbody>
                    ${block1Content}
                    <tr>
                        <td class="block-header"><strong>БЛОК 2</strong></td>
                        <td colspan="11" class="block-description"><em>Дані вносить спеціаліст, який проводить тестування</em></td>
                    </tr>
                    ${block2Content}
                </tbody>
            </table>

            <table class="test-table-3">
                ${block3Content}
            </table>

            <div class="note">
                <p><strong><em>*Ураженість, %</em> -- 0-30 -- низька, 30-70 -- середня, 70-100 -- висока.</strong></p>
            </div>

            <div class="conclusions">
                <p><strong>Висновки:</strong></p>
                <br>${safeGet(conclusion)}<br><br>
                <p><strong>Рекомендації:</strong></p>
            </div>

        </body>
        </html>
    `;
}