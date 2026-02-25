<?php



namespace App\Http\Controllers\Api;



use App\Http\Controllers\Controller;

use Illuminate\Http\JsonResponse;



class BootController extends Controller

{

    public function getSpecs(): JsonResponse

    {

        // 1. Modelo Fallback (Seus nomes de variáveis originais)

        $fallback = [

            'bios_name' => 'MEGABIOS(C) 2026',

            'vendor' => 'DogNew Informática, MEI',

            'cpu' => 'Intel(R) Xeon(R) CPU E5-2666 v3 @ 2.90GHz',

            'speed' => '2900MHz',

            'ram' => '31.24 GB',

            'storage' => 'NVME: Samsung 980 Pro 1TB',

            'motherboard' => 'Dell Inc. 0WCJNT (PowerEdge R730)'

        ];



        try {

            // 2. Captura de CPU e RAM Real (Permitido pela HostGator)

            $cpuInfo = @file_get_contents('/proc/cpuinfo');

            if ($cpuInfo && preg_match('/model name\s+:\s+(.*)$/m', $cpuInfo, $matches)) {

                $fallback['cpu'] = trim($matches[1]);

            }



            $memInfo = @file_get_contents('/proc/meminfo');

            if ($memInfo && preg_match('/MemTotal:\s+(\d+) kB/', $memInfo, $matches)) {

                $total_gb = round($matches[1] / 1024 / 1024, 2);

                $fallback['ram'] = $total_gb . " GB";

            }



            // 3. Lógica de Placa-Mãe Profissional (Condicional de Engenharia)

            $boardPath = '/sys/class/dmi/id/board_name';

            $boardName = file_exists($boardPath) ? trim(@file_get_contents($boardPath)) : '';



            // Se o dado for bloqueado (HostGator) ou for genérico, aplicamos o Fallback Coerente

            if (empty($boardName) || stripos($boardName, 'Acesso Negado') !== false || stripos($boardName, 'Standard') !== false) {

                if (stripos($fallback['cpu'], 'Xeon') !== false) {

                    $fallback['motherboard'] = 'Dell Inc. 0WCJNT (PowerEdge R730)';

                } elseif (stripos($fallback['cpu'], 'AMD') !== false) {

                    $fallback['motherboard'] = 'Supermicro H11DSi (AMD EPYC Node)';

                } else {

                    $fallback['motherboard'] = 'ASUSTeK COMPUTER INC. PRIME Z270-A';

                }

            } else {

                $vendor = trim(@file_get_contents('/sys/class/dmi/id/board_vendor'));

                $fallback['motherboard'] = "$vendor $boardName";

            }



            // 4. Captura do Storage (Limpando "QEMU" ou "Virtual")

            $disks = glob('/sys/block/sd*') ?: glob('/sys/block/nvme*');

            if (!empty($disks)) {

                $diskModel = trim(@file_get_contents($disks[0] . "/device/model"));

                

                // Só substitui se NÃO for um disco virtual/genérico

                if (!empty($diskModel) && stripos($diskModel, 'QEMU') === false && stripos($diskModel, 'Virtual') === false) {

                    $fallback['storage'] = $diskModel;

                }

            }



        } catch (\Exception $e) {

            // Em caso de erro, o array $fallback inicial segue intacto

        }



        return response()->json($fallback);

    }

}