#include <iostream>
#include <string>
#define STB_IMAGE_IMPLEMENTATION
#include "lib/stb/stb_image.h"
#define STB_IMAGE_WRITE_IMPLEMENTATION
#include "lib/stb/stb_image_write.h"
#include <chrono>
#include <vector>
#define STB_IMAGE_RESIZE_IMPLEMENTATION
#include "lib/stb/stb_image_resize2.h"
#include "lib/json/json.hpp"
#include <fstream>
#include <filesystem>
#include <unordered_map>
#include <thread>

using namespace std;
using json = nlohmann::json;
namespace fs = filesystem;

typedef struct {
    string path;
    float cosine;
} Result;

typedef struct {
    float h;
    float s;
    float v;
} HSV;


float max(float a, float b) {
    if (a >= b) {
        return a;
    }
    else {
        return b;
    }
}

float min(float a, float b) {
    if (a < b) {
        return a;
    }
    else {
        return b;
    }
}


void convertHSV(vector <vector <HSV>> *hsv, const float* imgVector, int height, int width) {
    int i, j, k = 0;
    for (i = 0; i < height; i++) {
        for (j = 0; j < width; j++) {
            float r = static_cast<float>(imgVector[k]) / 255;
            float g = static_cast<float>(imgVector[k + 1]) / 255;
            float b = static_cast<float>(imgVector[k + 2]) / 255;
            float cmax = max(r, max(g, b));
            float cmin = min(r, min(g, b));
            float delta = cmax - cmin;
            float h;
            if (delta == 0) {
                h = 0;
            } else if (cmax == r) {
                float temp = ((g - b) / delta);
                int temp2 = (int) temp;
                h = 60 * ((float) (temp2 % 6) + (temp - (float) temp2));
            } else if (cmax == g) {
                h = 60 * (((b - r) / delta) + 2);
            } else {
                h = 60 * (((r - g) / delta) + 4);
            }

            float s, v;
            if (cmax == 0) {
                s = 0;
            } else {
                s = (delta / cmax);
            }


            v = cmax;

            (*hsv)[i][j].h = h;
            (*hsv)[i][j].s = s;
            (*hsv)[i][j].v = v;
            k += 3;
        }
    }
}


vector <vector <HSV>> convertOriginalImagetoHSV(const string &filename) {
    int width, height, channel;
    const char* c = filename.c_str();
    unsigned char* img = stbi_load(c, &width, &height, &channel, 3);
    auto *imgVector = new float[width * height * channel];
    copy(img, img + width * height * channel, imgVector);
    free(img);
    auto* hsv = new vector<vector<HSV>>(height, vector<HSV>(width));
    convertHSV(hsv, imgVector, height, width);
    return *hsv;
}


vector <vector <HSV>> convertQueryImagetoHSV(const string &filename, int expectedHeight, int expectedWidth) {
    int width, height, channel;
    const char* c = filename.c_str();
    unsigned char* img = stbi_load(c, &width, &height, &channel, 3);
    if (width != expectedWidth || height != expectedHeight) {
        auto* img_resized = new unsigned char[expectedWidth * expectedHeight * channel];
        stbir_resize(img, width, height, 0, img_resized, expectedWidth, expectedHeight, 0, STBIR_RGB, STBIR_TYPE_UINT8, STBIR_EDGE_CLAMP, STBIR_FILTER_DEFAULT);
        auto* hsv = new vector<vector<HSV>>(expectedHeight, vector<HSV>(expectedWidth));
        auto *imgVector = new float [expectedWidth * expectedHeight * channel];
        copy(img_resized, img_resized + expectedHeight * expectedWidth * channel, imgVector);
        convertHSV(hsv, imgVector,expectedHeight, expectedWidth);
        free(img);
        return *hsv;
    }
    else {
        auto* hsv = new vector<vector<HSV>>(height, vector<HSV>(width));
        auto* imgVector = new float[width * height * channel];
        copy(img, img + height * width * channel, imgVector);
        convertHSV(hsv, imgVector, height, width);
        free(img);
        return *hsv;
    }
}


string hashFunction(int histogram[14]) {
    char val[20] = {'a', 'b', 'c', 'd','e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
                    'p', 'q', 'r','\0'};
    string s = "\"";
    for (int i = 0; i < 14; i++) {
        if (histogram[i] <= 0) {
            continue;
        }
        else {
            if (histogram[i] > 16) {
                histogram[i] = 16;
            }
            s.push_back(val[i]);
            s.push_back(val[histogram[i]]);
        }
    }
    s.push_back('\"');
    return s;
}


vector <vector<int>> countHistogramOriginal(vector <vector <HSV>> hsv, int size) {
    auto *histogram = new vector<vector<int>>;
    int row = (int) hsv.size();
    int col = (int) hsv[0].size();
    for (int i = 0; i < row; i += size) {
        for (int j = 0; j < col; j += size) {
            auto *histTemp = new vector<int>(14, 0);
            for (int k = i; k < i + size; k++) {
                if (k >= row - 1) {
                    break;
                }
                for (int l = j; l < j + size; l++) {
                    if (l >= col - 1) {
                        break;
                    }
                    int hIndex = (int)(hsv[k][l].h / (360.0 / 8));
                    int sIndex = (int)(hsv[k][l].s * 100 / (100.0 / 3)) + 8;
                    int vIndex = (int)(hsv[k][l].v * 100 / (100.0 / 3)) + 11;
                    (*histTemp)[hIndex]++;
                    (*histTemp)[sIndex]++;
                    (*histTemp)[vIndex]++;
                }
            }
            (*histogram).push_back(*histTemp);
            free(histTemp);
            if (i + size >= row || j + size >= col) {
                break;
            }
        }
    }
    return *histogram;
}


vector <string> countHistogram(vector <vector <HSV>> hsv, int size) {
    vector <string> hashedHistogram;
    int row = (int)hsv.size();
    int col = (int)hsv[0].size();
    int histTemp[14] ={0};
    for (long int i = 0; i < row; i+=size) {
        for (long int j = 0; j < col; j+=size) {
            fill(histTemp, histTemp + 14, 0);
            for (int k = i; k < i + size; k++) {
                if (k >= row - 1) {
                    break;
                }
                for (int l = j; l < j + size; l++) {
                    if (l >= col - 1) {
                        break;
                    }
                    int hIndex = (int)(hsv[k][l].h / (360.0 / 8));
                    int sIndex = (int)(hsv[k][l].s * 100 / (100.0 / 3)) + 8;
                    int vIndex = (int)(hsv[k][l].v * 100 / (100.0 / 3)) + 11;
                    (histTemp)[hIndex]++;
                    (histTemp)[sIndex]++;
                    (histTemp)[vIndex]++;
                }
            }
            hashedHistogram.push_back(hashFunction(histTemp));
            if (i + size >= row || j + size >= col) {
                break;
            }
        }
    }
    return hashedHistogram;
}


int getNumberofFiles(const string& path) {
    int i = 0;
    for (const auto& entry : fs::directory_iterator(path)) {
        i++;
    }
    return i;
}


vector <string> getAllFilesName(const string& path) {
    vector <string> filesName;
    for (const auto& entry : fs::directory_iterator(path)) {
        filesName.push_back(entry.path().filename().string());
    }
    return filesName;
}


void queryProcessCache(const string& pathFolder, const string& pathCache, int start, int end, vector <string> listAllFiles,
                       int heightImageInserted, int widthImageInserted) {
    int sum = 0;
    for (int i = start; i < end; i++) {
        ofstream o(pathCache, ios_base::app);
        if (!o.is_open()) {
            cout << "Error opening file" << endl;
            return;
        }
        vector<vector<HSV>> imageHSV = convertQueryImagetoHSV(pathFolder + listAllFiles[i],
                                                              heightImageInserted, widthImageInserted);
        vector<string> result = countHistogram(imageHSV, 4);
        int len = (int) result.size();
        if (i == start) {
            o << "[";
        }
        o << "[";

        for (const auto &j: result) {
            o << j;
            if (len != 1) {
                o << ",";
            }
            len--;
        }

        if (i == end - 1) {
            o << "]";
        } else {
            o << "],";
        }

        if (i == end - 1) { // Image terakhir, penutup satu array besar
            o << "]";
        }
        sum++;
        o.close();
    }
}


void queryDatasetIntoJSON(const string& path, int heightImageInserted, int widthImageInserted) {
    vector <string> filesName = getAllFilesName(path);
    int num = (int)filesName.size();
    int fileEachThread = num / 4;
    try {
        thread t1([&]() { queryProcessCache(path, "cache1.json", 0, fileEachThread, filesName, heightImageInserted, widthImageInserted); });
        thread t2([&]() { queryProcessCache(path, "cache2.json", fileEachThread, fileEachThread*2, filesName, heightImageInserted, widthImageInserted); });
        thread t3([&]() { queryProcessCache(path, "cache3.json", fileEachThread*2, fileEachThread*3, filesName, heightImageInserted, widthImageInserted); });
        thread t4([&]() { queryProcessCache(path, "cache4.json", fileEachThread*3, num, filesName, heightImageInserted, widthImageInserted); });
        t1.join();
        t2.join();
        t3.join();
        t4.join();
    }
    catch (const exception& e){
        cout << "Pemrosesan multi-threading tidak dapat dilakukan: " << e.what() << endl;
    }
    cout << "Query done!" << endl;
}


float cos(vector<int> A, vector<int> B) {
    float sum = 0;
    float lenA = 0.0f, lenB = 0.0f;
    for (int i = 0; i < A.size(); i++) {
        sum += (float)(A[i] * B[i]);
        lenA += (float)(A[i] * A[i]);
        lenB += (float)(B[i] * B[i]);
    }
    float denom = sqrt(lenA) * sqrt(lenB);
    if (denom == 0) {
        return 0.0f;
    } else {
        return sum / denom;
    }
}


vector <int> unhash(const string& s) {
    unordered_map <char, int> val = {{'a', 0}, {'b', 1}, {'c', 2}, {'d', 3}, {'e', 4}, {'f', 5}, {'g', 6},
                                     {'h', 7}, {'i', 8}, {'j', 9}, {'k', 10}, {'l', 11}, {'m', 12}, {'n', 13}, {'o', 14}, {'p', 15}, {'q', 16},
                                     {'r', 18}, {NULL, 19}
    };
    vector <int> res(14, 0);
    int index = 0;
    for (int i = 0; i < s.length(); i++) {
        if (i % 2 == 0) {
            index = val[s[i]];
        }
        else {
            res[index] = val[s[i]] - 1;
        }
    }
    return res;
}


float cosImage(vector <string> elem, vector <vector <int>> &histogramOri) {
    int i = 0;
    float sum = 0;
    for (const auto & j : elem) {
        sum += cos(histogramOri[i], unhash(j));
        i++;
    }
    return (sum / (float)i) * 100;
}


void processImage(vector <vector <int>> histogramOri, const string& pathJSON, int start, int end, vector <string> &filePath, vector <Result> *result) {
    ifstream file(pathJSON);
    if (!file.is_open()) {
        cerr << "Error opening file " << pathJSON << endl;
        return;
    }
    json data;
    try {
        file >> data;
        for (int i = 0; i < data.size(); i++) {
            cout << "Processing " << filePath[i + start] << endl;
            float cosine = cosImage(data[i], histogramOri);
            if (cosine > 99.9) {
                cosine = 100;
            }
            if (cosine > 60) {
                Result resultTemp;
                resultTemp.path = filePath[i + start];
                resultTemp.cosine = cosine;
                result->push_back(resultTemp);
            }
        }
    }
    catch (const exception& e) {
        cout << "Error di file: " << pathJSON << ": " << e.what() << endl;
    }
}



void calculateResult(const string &pathQuery, vector<vector<int>> histogramOri, vector <Result> *resultVector) {
    vector <string> filePath;
    for (const auto &entry : fs::directory_iterator(pathQuery)) {
        filePath.push_back(entry.path().filename().string());
    }
    int numFile = (int)filePath.size();
    int fileEachThread = numFile / 4;
    try {
        thread t4([&]() { processImage(histogramOri, "cache1.json", 0, fileEachThread, filePath, resultVector); });
        thread t5([&]() {
            processImage(histogramOri, "cache2.json", fileEachThread, fileEachThread * 2, filePath, resultVector);
        });
        thread t6([&]() {
            processImage(histogramOri, "cache3.json", fileEachThread * 2, fileEachThread * 3, filePath, resultVector);
        });
        thread t7([&]() { processImage(histogramOri, "cache4.json", fileEachThread * 3, numFile, filePath, resultVector); });
        t4.join();
        t5.join();
        t6.join();
        t7.join();
    }
    catch (const exception& e) {
        cout << "Pemrosesan multi-threading tidak dapat dilakukan: " << e.what() << endl;
    }
}


void saveResulttoJSON(vector <Result> &result, const string& filename) {
    json jsonOutput;
    cout << "Saving result.." << endl;

        for (const auto &i: result) {
            jsonOutput.push_back({
                                         {"path",   i.path},
                                         {"cosine", i.cosine}
                                 });
        }


    ofstream outputFile(filename);
    if (!outputFile.is_open()) {
        cout << "Error opening file" << endl;
        return;
    } else {
        if (result.empty()) {
            outputFile << "[]";
        }
        else {
            outputFile << jsonOutput.dump(2) << endl;
        }
    }

}


int binarySearch(const vector<Result>& a, float item,
                 int low, int high) {
    if (high <= low)
        return (item < a[low].cosine) ?
               (low + 1) : low;

    int mid = (low + high) / 2;

    if (item == a[mid].cosine)
        return mid + 1;

    if (item < a[mid].cosine)
        return binarySearch(a, item, mid + 1, high);
    return binarySearch(a, item, low, mid - 1);
}


void sortResult(vector<Result>& a) {
    int i, j, loc;
    float selected;
    for (i = 1; i < a.size(); ++i) {
        j = i - 1;
        selected = a[i].cosine;
        string selectedPath = a[i].path;

        loc = binarySearch(a, selected, 0, j);

        while (j >= loc) {
            a[j + 1].cosine = a[j].cosine;
            a[j + 1].path = a[j].path;
            j--;
        }
        a[j + 1].cosine = selected;
        a[j + 1].path = selectedPath;
    }
}


long long searchColor(const string& pathImageInserted, const string& pathDataset) {
    auto start = chrono::high_resolution_clock::now();
    int height, width, channel;
    int patokan = 0;
    for (const auto& entry : fs::directory_iterator(pathDataset)) {
        patokan++;
        string pathPatokan = pathDataset + entry.path().filename().string();
        stbi_info(pathPatokan.c_str(), &height, &width, &channel);
    }
    stbi_info(pathImageInserted.c_str(), &height, &width, &channel);
    if (!fs::exists("cache1.json") || !fs::exists("cache2.json") || !fs::exists("cache3.json") || !fs::exists("cache4.json")) {
        queryDatasetIntoJSON(pathDataset, height, width);
    }
    auto *histogramOri = new vector <vector<int>>;
    *histogramOri = countHistogramOriginal(convertQueryImagetoHSV(pathImageInserted, height, width), 4);

    auto *result = new vector <Result>;
    cout << "Started.." << endl;
    calculateResult(pathDataset, *histogramOri, result);
    sortResult(*result);
    saveResulttoJSON(*result, "query.json");
    auto end = chrono::high_resolution_clock::now();
    return chrono::duration_cast<chrono::milliseconds>(end - start).count();
}

int main() { 
    // CHANGE THIS PATH
    int w = searchColor("path/to/your/uploads/query.jpg", "uploads/dataset/");
    return 0;
}